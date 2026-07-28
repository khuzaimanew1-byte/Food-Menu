import { pgTable, text, integer, timestamp, numeric, check, index } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { sects } from './sects';

export const items = pgTable('items', {
  id:      text('id').primaryKey(),
  sect_id: text('sect_id').notNull()                        // [DB-CONSTRAINT] FK + cascade
             .references(() => sects.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  pos:     integer('pos').notNull(),                        // 0-based within section
  name:    text('name').notNull(),
  dsc:     text('dsc'),
  price:   numeric('price', { precision: 10, scale: 2 }).notNull().default('0'),
  img:     text('img'),                                     // [DB-ASSET] asset key, not URL
  shp:     text('shp').notNull().default('ic'),
  crt_at:  timestamp('crt_at', { withTimezone: true }).notNull().defaultNow(),
  upd_at:  timestamp('upd_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  check('items_shp_chk',   sql`${t.shp}   IN ('ic', 'sq', 'plq')`),
  check('items_pos_chk',   sql`${t.pos}   >= 0`),
  check('items_price_chk', sql`${t.price} >= 0`),
  index('items_sect_idx').on(t.sect_id),                   // [DB-INDEX] FK index
  index('items_ord_idx').on(t.sect_id, t.pos),             // [DB-INDEX] ordered list queries
]);

// [DB-SSOT] runtime Zod validators — TS types use Drizzle inference
export const insertItemScm = createInsertSchema(items).omit({ crt_at: true, upd_at: true });
export const selectItemScm = createSelectSchema(items);

export type Item    = typeof items.$inferSelect;
export type NewItem = typeof items.$inferInsert;
export type UpdItem = Partial<Omit<NewItem, 'id' | 'sect_id' | 'crt_at' | 'upd_at'>>;
