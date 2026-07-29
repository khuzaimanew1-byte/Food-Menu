// ── trshStr — soft-delete cache (localStorage, 7-day TTL) ────────────────
// Stores snapshots of deleted items/sections for 7 days.
// pruneTrash() is called on every push — no separate cleanup job needed.

const KEY = 'mc-trsh';
const TTL = 7 * 24 * 60 * 60 * 1000; // 7 days in ms

export type TrshType = 'item' | 'section';

export interface TrshEntry {
  id:        string;
  type:      TrshType;
  data:      unknown;  // MnItem or MnSect snapshot — kept for potential restore
  deletedAt: number;   // Date.now() at time of delete
}

// ── Storage helpers ───────────────────────────────────────────────────────

function load(): TrshEntry[] {
  try { return JSON.parse(localStorage.getItem(KEY) ?? '[]'); }
  catch { return []; }
}

function save(entries: TrshEntry[]): void {
  localStorage.setItem(KEY, JSON.stringify(entries));
}

// ── Public API ────────────────────────────────────────────────────────────

/** Remove all entries older than 7 days. */
export function pruneTrash(): void {
  const now = Date.now();
  save(load().filter(e => now - e.deletedAt < TTL));
}

/** Snapshot an item/section to trash before deletion (auto-prunes stale entries). */
export function pushToTrash(entry: Omit<TrshEntry, 'deletedAt'>): void {
  pruneTrash();
  const entries = load();
  entries.push({ ...entry, deletedAt: Date.now() });
  save(entries);
}

/** All non-expired trash entries (< 7 days old). */
export function getTrash(): TrshEntry[] {
  const now = Date.now();
  return load().filter(e => now - e.deletedAt < TTL);
}
