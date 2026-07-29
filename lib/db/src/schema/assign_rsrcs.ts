import { pgTable, text, numeric, integer, timestamp, index } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { assigns } from './assigns';
import { units }   from './units';

export const assign_rsrcs = pgTable('assign_rsrcs', {
  id:        text('id').primaryKey(),
  assign_id: text('assign_id').notNull()
               .references(() => assigns.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  name:      text('name').notNull().default(''),
  qty:       numeric('qty', { precision: 10, scale: 3 }).notNull().default('0'),
  unit_id:   text('unit_id')
               .references(() => units.id, { onDelete: 'set null', onUpdate: 'cascade' }),
  pos:       integer('pos').notNull().default(0),
  crt_at:    timestamp('crt_at', { withTimezone: true }).notNull().defaultNow(),
  upd_at:    timestamp('upd_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  index('assign_rsrcs_assign_idx').on(t.assign_id), // [DB-INDEX] FK index
]);

// [DB-SSOT] runtime Zod validators
export const insertAssignRsrcScm = createInsertSchema(assign_rsrcs).omit({ crt_at: true, upd_at: true });
export const selectAssignRsrcScm = createSelectSchema(assign_rsrcs);

export type AssignRsrc    = typeof assign_rsrcs.$inferSelect;
export type NewAssignRsrc = typeof assign_rsrcs.$inferInsert;
export type UpdAssignRsrc = Partial<Pick<NewAssignRsrc, 'name' | 'qty' | 'unit_id' | 'pos'>>;
