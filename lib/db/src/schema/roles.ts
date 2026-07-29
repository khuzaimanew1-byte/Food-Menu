import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const roles = pgTable('roles', {
  id:     text('id').primaryKey(),
  name:   text('name').notNull(),
  crt_at: timestamp('crt_at', { withTimezone: true }).notNull().defaultNow(),
  upd_at: timestamp('upd_at', { withTimezone: true }).notNull().defaultNow(),
});

// [DB-SSOT] runtime Zod validators
export const insertRoleScm = createInsertSchema(roles).omit({ crt_at: true, upd_at: true });
export const selectRoleScm = createSelectSchema(roles);

export type Role    = typeof roles.$inferSelect;
export type NewRole = typeof roles.$inferInsert;
export type UpdRole = Partial<Pick<NewRole, 'name'>>;
