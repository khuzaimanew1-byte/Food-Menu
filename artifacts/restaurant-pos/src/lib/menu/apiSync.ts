// ── apiSync — fire-and-forget DB sync helpers ────────────────────────────
// Plain TS module. No imports from menuStore (avoids circular deps).
// All async errors are logged to console but never propagate — UI is optimistic.

import {
  listSects,
  queryItems,
  createSect,
  createItem,
  updateSect,
  updateItem,
  deleteSect,
  deleteItem  as _apiDeleteItem,
  reordSects,
  reordItems,
} from '@workspace/api-client-react';
import type { MnSect } from './menuStore';

// ── DB row → local shape ──────────────────────────────────────────────────

type DbSect = { id: string; pos: number; name: string };
type DbItem = {
  id: string; sect_id: string; pos: number; name: string;
  dsc?: string | null; price?: string | null; img?: string | null;
};

function mapToLocal(sects: DbSect[], items: DbItem[]): MnSect[] {
  return [...sects]
    .sort((a, b) => a.pos - b.pos)
    .map((s: DbSect) => ({
      title: s.name,
      dbId:  s.id,
      items: items
        .filter(it => it.sect_id === s.id)
        .sort((a, b) => a.pos - b.pos)
        .map(it => ({
          id:          it.id,
          name:        it.name,
          description: it.dsc            ?? undefined,
          price:       it.price != null  ? String(it.price) : undefined,
          image:       it.img            ?? undefined,
        })),
    }));
}

// ── Initial load ──────────────────────────────────────────────────────────

/** Returns true for errors that are worth retrying (server starting up, network blip). */
function isTransient(e: unknown): boolean {
  if (e instanceof TypeError) return true;               // network / CORS / fetch failed
  if (e && typeof e === 'object' && 'status' in e) {
    const s = (e as { status: number }).status;
    return s === 0 || s === 502 || s === 503 || s === 504;
  }
  return false;
}

/**
 * Fetch all with smart retry.
 *
 * - Tries once immediately.
 * - Retries ONLY on transient errors (502 / 503 / 504 / network failure).
 * - Fails fast on permanent errors (401, 404, 500, etc.) — no wasted requests.
 * - Uses exponential back-off (baseDelayMs × 2ⁿ) between attempts.
 * - Aborts cleanly when the AbortSignal fires (e.g. component unmounts).
 */
export async function fetchAllWithRetry(opts: {
  maxAttempts?: number;
  baseDelayMs?: number;
  signal?:      AbortSignal;
}): Promise<MnSect[] | null> {
  const { maxAttempts = 3, baseDelayMs = 1000, signal } = opts;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    if (signal?.aborted) return null;

    try {
      const sectPage = await listSects({ sz: 200 });
      const allSects = sectPage.data;
      if (!allSects.length) return [];
      const allItems = await queryItems({ sectIds: allSects.map(s => s.id), sz: 1000 });
      return mapToLocal(allSects as DbSect[], allItems as DbItem[]);
    } catch (e: unknown) {
      if (!isTransient(e)) {
        // Permanent error — no point retrying
        console.warn('[apiSync] fetchAll permanent error:', e);
        return null;
      }

      const isLast = attempt === maxAttempts - 1;
      if (isLast) {
        console.warn('[apiSync] fetchAll failed after', maxAttempts, 'attempts:', e);
        return null;
      }

      // Transient — wait then retry
      const delay = baseDelayMs * 2 ** attempt;
      console.warn(`[apiSync] fetchAll attempt ${attempt + 1} failed, retrying in ${delay}ms…`);
      await new Promise<void>((res, rej) => {
        const t = setTimeout(res, delay);
        signal?.addEventListener('abort', () => { clearTimeout(t); rej(); }, { once: true });
      }).catch(() => null);

      if (signal?.aborted) return null;
    }
  }

  return null;
}

// ── Item mutations ────────────────────────────────────────────────────────

/**
 * Create an item in the DB.  Returns the real DB nanoid, or null on failure.
 * Call this immediately after adding a tmp-N item to the local store.
 */
export async function apiCreateItem(
  sectDbId: string,
  fields: { name?: string; dsc?: string; price?: string },
): Promise<string | null> {
  try {
    const row = await createItem({ sect_id: sectDbId, name: fields.name ?? 'New Item', ...fields });
    return row.id;
  } catch (e: unknown) {
    console.error('[apiSync] createItem:', e);
    return null;
  }
}

/** PATCH an item's editable fields. No-op for tmp- IDs not yet in DB. */
export function apiPatchItem(
  id:     string,
  fields: { name?: string; dsc?: string; price?: string },
): void {
  if (id.startsWith('tmp-')) return;
  updateItem(id, fields).catch((e: unknown) => console.error('[apiSync] updateItem:', e));
}

/** DELETE an item from the DB. No-op for tmp- IDs. */
export function apiDelItem(id: string): void {
  if (id.startsWith('tmp-')) return;
  _apiDeleteItem(id).catch((e: unknown) => console.error('[apiSync] deleteItem:', e));
}

/** PATCH item order for a section. Skips tmp- IDs. */
export function apiReordItems(ids: string[], sectId?: string): void {
  const real = ids.filter(id => !id.startsWith('tmp-'));
  if (!real.length) return;
  reordItems({ ids: real, ...(sectId ? { sectId } : {}) })
    .catch((e: unknown) => console.error('[apiSync] reordItems:', e));
}

// ── Section mutations ─────────────────────────────────────────────────────

/**
 * Create a section in the DB.  Returns its DB nanoid, or null on failure.
 * Call this immediately after appending a new section to the local store.
 */
export async function apiCreateSect(name: string): Promise<string | null> {
  try {
    const row = await createSect({ name, shp: 'ic' });
    return row.id;
  } catch (e: unknown) {
    console.error('[apiSync] createSect:', e);
    return null;
  }
}

/** PATCH a section's name after inline title edit. */
export function apiPatchSect(dbId: string, name: string): void {
  updateSect(dbId, { name }).catch((e: unknown) => console.error('[apiSync] updateSect:', e));
}

/** DELETE a section from the DB (cascades to items). */
export function apiDelSect(dbId: string): void {
  deleteSect(dbId).catch((e: unknown) => console.error('[apiSync] deleteSect:', e));
}

/** PATCH section order — send the full ordered dbId list. */
export function apiReordSects(dbIds: string[]): void {
  if (!dbIds.length) return;
  reordSects({ ids: dbIds }).catch((e: unknown) => console.error('[apiSync] reordSects:', e));
}
