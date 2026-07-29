import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const units = pgTable('units', {
  id:     text('id').primaryKey(),
  name:   text('name').notNull(),
  crt_at: timestamp('crt_at', { withTimezone: true }).notNull().defaultNow(),
  upd_at: timestamp('upd_at', { withTimezone: true }).notNull().defaultNow(),
});

// [DB-SSOT] runtime Zod validators
export const insertUnitScm = createInsertSchema(units).omit({ crt_at: true, upd_at: true });
export const selectUnitScm = createSelectSchema(units);

export type Unit    = typeof units.$inferSelect;
export type NewUnit = typeof units.$inferInsert;
export type UpdUnit = Partial<Pick<NewUnit, 'name'>>;
