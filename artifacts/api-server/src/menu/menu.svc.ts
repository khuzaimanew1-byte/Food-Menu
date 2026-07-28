import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { eq, asc, sql, inArray }                 from 'drizzle-orm';
import type { NodePgDatabase }                   from 'drizzle-orm/node-postgres';
import {
  sects, items, mkId,
  type NewSect, type UpdSect,
  type NewItem, type UpdItem,
} from '@workspace/db';
import type * as schema from '@workspace/db';
import { DB_TOKEN }     from '../db/db.mod';

type Db = NodePgDatabase<typeof schema>;

// [DB-SELECT] only query required columns
const SECT_COLS = {
  id: sects.id, name: sects.name, pos: sects.pos,
  shp: sects.shp, crt_at: sects.crt_at, upd_at: sects.upd_at,
};
const ITEM_COLS = {
  id: items.id, sect_id: items.sect_id, pos: items.pos,
  name: items.name, dsc: items.dsc, price: items.price,
  img: items.img, shp: items.shp, crt_at: items.crt_at, upd_at: items.upd_at,
};

@Injectable()
export class MenuSvc {
  constructor(@Inject(DB_TOKEN) private readonly db: Db) {}

  // ── Sections ──────────────────────────────────────────────────────────────

  async listSects(pg = 0, sz = 20) {
    const [rows, [{ tot }]] = await Promise.all([
      this.db.select(SECT_COLS).from(sects)
        .orderBy(asc(sects.pos)).limit(sz).offset(pg * sz),
      this.db.select({ tot: sql<number>`count(*)::int` }).from(sects),
    ]);
    return { data: rows, pg, sz, tot: tot ?? 0 };
  }

  async getSect(id: string) {
    const [row] = await this.db.select(SECT_COLS).from(sects)
      .where(eq(sects.id, id)).limit(1);
    if (!row) throw new NotFoundException(`Section ${id} not found`);
    return row;
  }

  async createSect(dto: Omit<NewSect, 'id'>) {
    const [{ maxPos }] = await this.db
      .select({ maxPos: sql<number>`coalesce(max(pos), -1)::int` }).from(sects);
    const [row] = await this.db.insert(sects)
      .values({ ...dto, id: mkId(), pos: (maxPos ?? -1) + 1 })
      .returning(SECT_COLS);
    return row;
  }

  // [API-BULK] bulk create in one transaction [DB-TX]
  async bulkNewSect(dtos: Omit<NewSect, 'id'>[]) {
    return this.db.transaction(async (tx) => {
      const [{ base }] = await tx
        .select({ base: sql<number>`coalesce(max(pos), -1)::int` }).from(sects);
      const rows = dtos.map((d, i) => ({ ...d, id: mkId(), pos: (base ?? -1) + 1 + i }));
      return tx.insert(sects).values(rows).returning(SECT_COLS);
    });
  }

  async updSect(id: string, dto: UpdSect) {
    const [row] = await this.db.update(sects)
      .set({ ...dto, upd_at: new Date() })
      .where(eq(sects.id, id))
      .returning(SECT_COLS);
    if (!row) throw new NotFoundException(`Section ${id} not found`);
    return row;
  }

  async delSect(id: string) {
    // [DB-TX] delete + resequence remaining positions atomically
    await this.db.transaction(async (tx) => {
      const [row] = await tx.delete(sects).where(eq(sects.id, id)).returning({ pos: sects.pos });
      if (!row) throw new NotFoundException(`Section ${id} not found`);
      await tx.execute(sql`
        UPDATE sects SET pos = pos - 1, upd_at = now()
        WHERE pos > ${row.pos}
      `);
    });
  }

  // [DB-TX] reorder: accept ordered id array → assign pos 0,1,2...
  async reordSects(ids: string[]) {
    if (!ids.length) return;
    await this.db.transaction(async (tx) => {
      for (let i = 0; i < ids.length; i++) {
        await tx.update(sects)
          .set({ pos: i, upd_at: new Date() })
          .where(eq(sects.id, ids[i]));
      }
    });
  }

  // ── Items ─────────────────────────────────────────────────────────────────

  async listItems(sectId: string, pg = 0, sz = 20) {
    // [API-FIELDS] N+1 prevented — single query with section filter
    const [rows, [{ tot }]] = await Promise.all([
      this.db.select(ITEM_COLS).from(items)
        .where(eq(items.sect_id, sectId))
        .orderBy(asc(items.pos)).limit(sz).offset(pg * sz),
      this.db.select({ tot: sql<number>`count(*)::int` }).from(items)
        .where(eq(items.sect_id, sectId)),
    ]);
    return { data: rows, pg, sz, tot: tot ?? 0 };
  }

  // [API-FIELDS] list items for multiple sections — no N+1
  async listItemsBulk(sectIds: string[], pg = 0, sz = 20) {
    const rows = await this.db.select(ITEM_COLS).from(items)
      .where(inArray(items.sect_id, sectIds))
      .orderBy(asc(items.sect_id), asc(items.pos))
      .limit(sz).offset(pg * sz);
    return rows;
  }

  async getItem(id: string) {
    const [row] = await this.db.select(ITEM_COLS).from(items)
      .where(eq(items.id, id)).limit(1);
    if (!row) throw new NotFoundException(`Item ${id} not found`);
    return row;
  }

  async createItem(dto: Omit<NewItem, 'id'>) {
    const [{ maxPos }] = await this.db
      .select({ maxPos: sql<number>`coalesce(max(pos), -1)::int` })
      .from(items).where(eq(items.sect_id, dto.sect_id));
    const [row] = await this.db.insert(items)
      .values({ ...dto, id: mkId(), pos: (maxPos ?? -1) + 1 })
      .returning(ITEM_COLS);
    return row;
  }

  async bulkNewItem(dtos: Omit<NewItem, 'id'>[]) {
    return this.db.transaction(async (tx) => {
      // group by sect_id to compute correct pos offsets per section
      const bySection = new Map<string, typeof dtos>();
      for (const d of dtos) {
        if (!bySection.has(d.sect_id)) bySection.set(d.sect_id, []);
        bySection.get(d.sect_id)!.push(d);
      }
      const results: Awaited<ReturnType<typeof tx.insert>>[] = [];
      for (const [sid, sdtos] of bySection) {
        const [{ base }] = await tx
          .select({ base: sql<number>`coalesce(max(pos), -1)::int` })
          .from(items).where(eq(items.sect_id, sid));
        const rows = sdtos.map((d, i) => ({ ...d, id: mkId(), pos: (base ?? -1) + 1 + i }));
        results.push(await tx.insert(items).values(rows).returning(ITEM_COLS));
      }
      return results.flat();
    });
  }

  async updItem(id: string, dto: UpdItem) {
    const [row] = await this.db.update(items)
      .set({ ...dto, upd_at: new Date() })
      .where(eq(items.id, id))
      .returning(ITEM_COLS);
    if (!row) throw new NotFoundException(`Item ${id} not found`);
    return row;
  }

  async delItem(id: string) {
    await this.db.transaction(async (tx) => {
      const [row] = await tx.delete(items).where(eq(items.id, id))
        .returning({ pos: items.pos, sect_id: items.sect_id });
      if (!row) throw new NotFoundException(`Item ${id} not found`);
      await tx.execute(sql`
        UPDATE items SET pos = pos - 1, upd_at = now()
        WHERE sect_id = ${row.sect_id} AND pos > ${row.pos}
      `);
    });
  }

  // Reorder items — optionally move to a different section
  async reordItems(ids: string[], sectId?: string) {
    if (!ids.length) return;
    await this.db.transaction(async (tx) => {
      for (let i = 0; i < ids.length; i++) {
        await tx.update(items)
          .set({ pos: i, ...(sectId ? { sect_id: sectId } : {}), upd_at: new Date() })
          .where(eq(items.id, ids[i]));
      }
    });
  }
}
