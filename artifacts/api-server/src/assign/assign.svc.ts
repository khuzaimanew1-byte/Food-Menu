import { Injectable, Inject, NotFoundException, ConflictException } from '@nestjs/common';
import { eq, asc, inArray, sql }   from 'drizzle-orm';
import type { NodePgDatabase }     from 'drizzle-orm/node-postgres';
import {
  roles, units, assigns, assign_emps, assign_rsrcs, mkId,
  type Role, type Unit, type Assign,
} from '@workspace/db';
import type * as schema from '@workspace/db';
import { DB_TOKEN } from '../db/db.mod';

type Db = NodePgDatabase<typeof schema>;

// ── Column subsets ──────────────────────────────────────────────────────────

const ROLE_COLS  = { id: roles.id,  name: roles.name,  crt_at: roles.crt_at,  upd_at: roles.upd_at  };
const UNIT_COLS  = { id: units.id,  name: units.name,  crt_at: units.crt_at,  upd_at: units.upd_at  };
const ASGN_COLS  = { id: assigns.id, item_id: assigns.item_id, margin: assigns.margin };
const EMP_COLS   = { id: assign_emps.id, assign_id: assign_emps.assign_id, name: assign_emps.name, role_id: assign_emps.role_id, pos: assign_emps.pos };
const RSRC_COLS  = { id: assign_rsrcs.id, assign_id: assign_rsrcs.assign_id, name: assign_rsrcs.name, qty: assign_rsrcs.qty, unit_id: assign_rsrcs.unit_id, pos: assign_rsrcs.pos };

// ── Upsert payload types ────────────────────────────────────────────────────

export interface EmpInput  { name: string; role_id: string | null }
export interface RsrcInput { name: string; qty: string; unit_id: string | null }
export interface UpsertAssignDto {
  item_id:   string;
  margin:    string;
  employees: EmpInput[];
  resources: RsrcInput[];
}

@Injectable()
export class AssignSvc {
  constructor(@Inject(DB_TOKEN) private readonly db: Db) {}

  // ── Roles ─────────────────────────────────────────────────────────────────

  async listRoles(): Promise<Role[]> {
    return this.db.select(ROLE_COLS).from(roles).orderBy(asc(roles.name));
  }

  async createRole(name: string): Promise<Role> {
    const [row] = await this.db.insert(roles)
      .values({ id: mkId(), name })
      .returning(ROLE_COLS);
    return row;
  }

  async updateRole(id: string, name: string): Promise<Role> {
    const [row] = await this.db.update(roles)
      .set({ name, upd_at: new Date() })
      .where(eq(roles.id, id))
      .returning(ROLE_COLS);
    if (!row) throw new NotFoundException(`Role ${id} not found`);
    return row;
  }

  async deleteRole(id: string): Promise<void> {
    const [row] = await this.db.delete(roles).where(eq(roles.id, id)).returning({ id: roles.id });
    if (!row) throw new NotFoundException(`Role ${id} not found`);
    // FK is set null on assign_emps → no cascade needed
  }

  // ── Units ─────────────────────────────────────────────────────────────────

  async listUnits(): Promise<Unit[]> {
    return this.db.select(UNIT_COLS).from(units).orderBy(asc(units.name));
  }

  async createUnit(name: string): Promise<Unit> {
    const [row] = await this.db.insert(units)
      .values({ id: mkId(), name })
      .returning(UNIT_COLS);
    return row;
  }

  async updateUnit(id: string, name: string): Promise<Unit> {
    const [row] = await this.db.update(units)
      .set({ name, upd_at: new Date() })
      .where(eq(units.id, id))
      .returning(UNIT_COLS);
    if (!row) throw new NotFoundException(`Unit ${id} not found`);
    return row;
  }

  async deleteUnit(id: string): Promise<void> {
    const [row] = await this.db.delete(units).where(eq(units.id, id)).returning({ id: units.id });
    if (!row) throw new NotFoundException(`Unit ${id} not found`);
  }

  // ── Assigns ───────────────────────────────────────────────────────────────

  /** Fetch full assign record (with employees + resources) for an item. Returns null if none. */
  async getAssign(itemId: string) {
    const [asgn] = await this.db.select(ASGN_COLS).from(assigns)
      .where(eq(assigns.item_id, itemId)).limit(1);
    if (!asgn) return null;

    const [emps, rsrcs] = await Promise.all([
      this.db.select(EMP_COLS).from(assign_emps)
        .where(eq(assign_emps.assign_id, asgn.id))
        .orderBy(asc(assign_emps.pos)),
      this.db.select(RSRC_COLS).from(assign_rsrcs)
        .where(eq(assign_rsrcs.assign_id, asgn.id))
        .orderBy(asc(assign_rsrcs.pos)),
    ]);

    return { ...asgn, employees: emps, resources: rsrcs };
  }

  /**
   * Create or update a full assign record in one transaction.
   * - If assign for item_id exists → update margin + replace emp/rsrc rows
   * - If not → create assign + emp/rsrc rows
   */
  async upsertAssign(dto: UpsertAssignDto) {
    return this.db.transaction(async (tx) => {
      // Find or create the assign record
      let [existing] = await tx.select(ASGN_COLS).from(assigns)
        .where(eq(assigns.item_id, dto.item_id)).limit(1);

      let assignId: string;
      if (existing) {
        await tx.update(assigns)
          .set({ margin: dto.margin, upd_at: new Date() })
          .where(eq(assigns.id, existing.id));
        assignId = existing.id;
      } else {
        const [row] = await tx.insert(assigns)
          .values({ id: mkId(), item_id: dto.item_id, margin: dto.margin })
          .returning(ASGN_COLS);
        assignId = row.id;
      }

      // Replace emp rows: delete all + re-insert in order
      await tx.delete(assign_emps).where(eq(assign_emps.assign_id, assignId));
      if (dto.employees.length) {
        await tx.insert(assign_emps).values(
          dto.employees.map((e, i) => ({
            id:        mkId(),
            assign_id: assignId,
            name:      e.name,
            role_id:   e.role_id ?? null,
            pos:       i,
          })),
        );
      }

      // Replace rsrc rows: delete all + re-insert in order
      await tx.delete(assign_rsrcs).where(eq(assign_rsrcs.assign_id, assignId));
      if (dto.resources.length) {
        await tx.insert(assign_rsrcs).values(
          dto.resources.map((r, i) => ({
            id:        mkId(),
            assign_id: assignId,
            name:      r.name,
            qty:       r.qty,
            unit_id:   r.unit_id ?? null,
            pos:       i,
          })),
        );
      }

      // Fetch fresh full record to return
      const [emps, rsrcs] = await Promise.all([
        tx.select(EMP_COLS).from(assign_emps)
          .where(eq(assign_emps.assign_id, assignId))
          .orderBy(asc(assign_emps.pos)),
        tx.select(RSRC_COLS).from(assign_rsrcs)
          .where(eq(assign_rsrcs.assign_id, assignId))
          .orderBy(asc(assign_rsrcs.pos)),
      ]);

      return { id: assignId, item_id: dto.item_id, margin: dto.margin, employees: emps, resources: rsrcs };
    });
  }

  async deleteAssign(id: string): Promise<void> {
    const [row] = await this.db.delete(assigns).where(eq(assigns.id, id)).returning({ id: assigns.id });
    if (!row) throw new NotFoundException(`Assign ${id} not found`);
  }
}
