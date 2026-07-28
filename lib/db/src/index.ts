import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL must be set');

// [DB-POOL] single shared pool for the process lifetime
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis:      30_000,
  connectionTimeoutMillis: 5_000,
});

// [DB-TIMEOUT] 10 s statement timeout applied to every connection on checkout
pool.on('connect', (client) => {
  client.query("SET statement_timeout = '10s'").catch(() => undefined);
});

export const db = drizzle(pool, { schema });
export * from './schema';

// [DB-ID] URL-safe NanoID generator — import here to keep a single copy
export { nanoid as mkId } from 'nanoid';
