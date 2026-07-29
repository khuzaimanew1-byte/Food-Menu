import { Pool }   from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema  from './schema';

// [DB-LAZY] Pool & drizzle instance are created on first use, not at import
// time.  This lets the API server start (and return 503 for DB routes) even
// when DATABASE_URL is absent, and connect automatically the moment the env
// var is available — no server restart required.

type DrizzleDb = ReturnType<typeof drizzle<typeof schema>>;

let _pool: Pool   | null = null;
let _db:   DrizzleDb | null = null;

/**
 * Returns the shared Drizzle instance, or null if DATABASE_URL is not set.
 * Creates the pool lazily on the first call where the URL is present.
 */
export function getDb(): DrizzleDb | null {
  const url = process.env['DATABASE_URL'];
  if (!url) return null;

  if (!_db) {
    _pool = new Pool({
      connectionString: url,
      max: 10,
      idleTimeoutMillis:      30_000,
      connectionTimeoutMillis: 5_000,
    });
    // [DB-TIMEOUT] 10 s statement timeout applied to every connection on checkout
    _pool.on('connect', (client) => {
      client.query("SET statement_timeout = '10s'").catch(() => undefined);
    });
    _db = drizzle(_pool, { schema });
  }

  return _db;
}

export function getPool(): Pool | null { return _pool; }
export * from './schema';

// [DB-ID] URL-safe NanoID generator — import here to keep a single copy
export { nanoid as mkId } from 'nanoid';
