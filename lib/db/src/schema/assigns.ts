import { pgTable, text, numeric, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { items } from './items';

export const assigns = pgTable('assigns', {
  id:      text('id').primaryKey(),
  item_id: text('item_id').notNull()
             .references(() => items.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  margin:  numeric('margin', { precision: 10, scale: 2 }).notNull().default('0'),
  crt_at:  timestamp('crt_at', { withTimezone: true }).notNull().defaultNow(),
  upd_at:  timestamp('upd_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  uniqueIndex('assigns_item_uniq').on(t.item_id), // [DB-CONSTRAINT] one assign per item
]);

// [DB-SSOT] runtime Zod validators
export const insertAssignScm = createInsertSchema(assigns).omit({ crt_at: true, upd_at: true });
export const selectAssignScm = createSelectSchema(assigns);

export type Assign    = typeof assigns.$inferSelect;
export type NewAssign = typeof assigns.$inferInsert;
export type UpdAssign = Partial<Pick<NewAssign, 'margin'>>;
