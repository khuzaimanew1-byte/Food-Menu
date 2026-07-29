import { pgTable, text, integer, timestamp, index } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { assigns } from './assigns';
import { roles }   from './roles';

export const assign_emps = pgTable('assign_emps', {
  id:        text('id').primaryKey(),
  assign_id: text('assign_id').notNull()
               .references(() => assigns.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  name:      text('name').notNull().default(''),
  role_id:   text('role_id')
               .references(() => roles.id, { onDelete: 'set null', onUpdate: 'cascade' }),
  pos:       integer('pos').notNull().default(0),
  crt_at:    timestamp('crt_at', { withTimezone: true }).notNull().defaultNow(),
  upd_at:    timestamp('upd_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  index('assign_emps_assign_idx').on(t.assign_id), // [DB-INDEX] FK index
]);

// [DB-SSOT] runtime Zod validators
export const insertAssignEmpScm = createInsertSchema(assign_emps).omit({ crt_at: true, upd_at: true });
export const selectAssignEmpScm = createSelectSchema(assign_emps);

export type AssignEmp    = typeof assign_emps.$inferSelect;
export type NewAssignEmp = typeof assign_emps.$inferInsert;
export type UpdAssignEmp = Partial<Pick<NewAssignEmp, 'name' | 'role_id' | 'pos'>>;
