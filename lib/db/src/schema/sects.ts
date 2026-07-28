import { pgTable, text, integer, timestamp, check, index } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

// [DB-CONSTRAINT] shape enum enforced at DB level
export const sects = pgTable('sects', {
  id:     text('id').primaryKey(),
  name:   text('name').notNull(),
  pos:    integer('pos').notNull(),                          // 0-based sequential ordering
  shp:    text('shp').notNull().default('ic'),
  crt_at: timestamp('crt_at', { withTimezone: true }).notNull().defaultNow(),
  upd_at: timestamp('upd_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  check('sects_shp_chk', sql`${t.shp} IN ('ic', 'sq', 'plq')`),
  check('sects_pos_chk', sql`${t.pos} >= 0`),
  index('sects_pos_idx').on(t.pos),                         // [DB-INDEX] ordering scans
]);

// [DB-SSOT] runtime Zod validators — TS types use Drizzle inference to avoid zod version drift
export const insertSectScm = createInsertSchema(sects).omit({ crt_at: true, upd_at: true });
export const selectSectScm = createSelectSchema(sects);

export type Sect    = typeof sects.$inferSelect;
export type NewSect = typeof sects.$inferInsert;
export type UpdSect = Partial<Omit<NewSect, 'id' | 'crt_at' | 'upd_at'>>;
