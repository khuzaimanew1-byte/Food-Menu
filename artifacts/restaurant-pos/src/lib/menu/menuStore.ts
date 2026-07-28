// ── Menu store — mutable source of truth for sections + items ─────────────
// Plain TS module, no React. Dispatches 'menu:change' when state mutates.
// MnPg listens to that event and re-paginates.

import type { MnItem } from '@/data/menu';
import type { SplPart } from '@/lib/spl/spl';
import { apiPatchItem, apiPatchSect, apiReordItems, apiReordSects } from './apiSync';

export interface MnSect {
  title: string;
  dbId?:  string;   // DB nanoid — set after API load or API create resolves
  items: MnItem[];
}

// Start empty; populated by loadFromDb() on app mount via fetchAll() + initSections().
// Falls back to hardcoded data only if loadFromDb() fails (see MnPg.tsx).
let _sections: MnSect[] = [];

function dispatch() {
  document.dispatchEvent(new CustomEvent('menu:change'));
}

// ── Read ──────────────────────────────────────────────────────────────────

/** Current sections in their present order. */
export function getSections(): MnSect[] {
  return _sections;
}

/** Look up a section's DB id by its title. */
export function getSectDbId(title: string): string | undefined {
  return _sections.find(s => s.title === title)?.dbId;
}

// ── Init & DB sync state ──────────────────────────────────────────────────

/**
 * Replace all sections with fresh data from the DB.
 * Called once on app mount after fetchAll() resolves.
 */
export function initSections(newSects: MnSect[]): void {
  _sections = newSects;
  dispatch();
}

/**
 * Update a tmp-N item id to the real DB nanoid after an API createItem call.
 * Does not dispatch — id change is invisible to React renderers.
 */
export function updItemId(tmpId: string, realId: string): void {
  for (const sect of _sections) {
    const item = sect.items.find(it => it.id === tmpId);
    if (item) { item.id = realId; return; }
  }
}

/** Store a section's DB id after an API createSect call resolves. */
export function updSectDbId(title: string, dbId: string): void {
  const sect = _sections.find(s => s.title === title);
  if (sect) sect.dbId = dbId;
}

/** Update a section's title in the store (called from edt:save handler). */
export function updSectTitle(oldTitle: string, newTitle: string): void {
  const sect = _sections.find(s => s.title === oldTitle);
  if (!sect || sect.title === newTitle) return;
  sect.title  = newTitle;
  _sections   = [..._sections];
  dispatch();
}

// ── Delete ────────────────────────────────────────────────────────────────

/** Remove an item from whichever section owns it. */
export function delItem(id: string): void {
  for (const sect of _sections) {
    const idx = sect.items.findIndex(it => it.id === id);
    if (idx !== -1) {
      sect.items.splice(idx, 1);
      _sections = [..._sections];
      dispatch();
      return;
    }
  }
}

/** Remove a section (and all its items) by title. */
export function delSection(title: string): void {
  const idx = _sections.findIndex(s => s.title === title);
  if (idx === -1) return;
  _sections.splice(idx, 1);
  _sections = [..._sections];
  dispatch();
}

// ── Reorder ───────────────────────────────────────────────────────────────

/**
 * Move an item before or after a target item.
 * Works across section boundaries.
 */
export function reorderItem(
  movingId: string,
  targetId: string,
  part:     SplPart,
): void {
  if (movingId === targetId) return;

  // Pull the moving item out
  let movingItem: MnItem | undefined;
  let sourceSect: MnSect | undefined;
  for (const sect of _sections) {
    const idx = sect.items.findIndex(it => it.id === movingId);
    if (idx !== -1) {
      [movingItem] = sect.items.splice(idx, 1);
      sourceSect = sect;
      break;
    }
  }
  if (!movingItem) return;

  // Insert before/after target
  let placed = false;
  let destSect: MnSect | undefined;
  for (const sect of _sections) {
    const tIdx = sect.items.findIndex(it => it.id === targetId);
    if (tIdx !== -1) {
      const at = part === 'start' ? tIdx : tIdx + 1;
      sect.items.splice(at, 0, movingItem);
      destSect = sect;
      placed = true;
      break;
    }
  }
  if (!placed) {
    _sections[_sections.length - 1].items.push(movingItem);
    destSect = _sections[_sections.length - 1];
  }

  _sections = [..._sections];
  dispatch();

  // Sync reorder to DB
  if (destSect) {
    apiReordItems(destSect.items.map(it => it.id), destSect.dbId);
  }
  // If item crossed sections, also sync the source section's new order
  if (sourceSect && sourceSect !== destSect) {
    apiReordItems(sourceSect.items.map(it => it.id), sourceSect.dbId);
  }
}

/**
 * Move a whole section before or after a target section.
 */
export function reorderSection(
  movingTitle: string,
  targetTitle: string,
  part:        SplPart,
): void {
  if (movingTitle === targetTitle) return;

  const mIdx = _sections.findIndex(s => s.title === movingTitle);
  if (mIdx === -1) return;

  const [movingSect] = _sections.splice(mIdx, 1);

  const tIdx = _sections.findIndex(s => s.title === targetTitle);
  const at   = tIdx === -1
    ? _sections.length
    : part === 'start' ? tIdx : tIdx + 1;

  _sections.splice(at, 0, movingSect);
  _sections = [..._sections];
  dispatch();

  // Sync section order to DB (only sections that have a dbId)
  apiReordSects(_sections.map(s => s.dbId).filter((id): id is string => !!id));
}

// ── Add ───────────────────────────────────────────────────────────────────

/**
 * Insert a new item before or after the target item.
 * Works across section boundaries.
 */
export function addItem(newItem: MnItem, targetId: string, part: SplPart): void {
  for (const sect of _sections) {
    const tIdx = sect.items.findIndex(it => it.id === targetId);
    if (tIdx !== -1) {
      const at = part === 'start' ? tIdx : tIdx + 1;
      sect.items.splice(at, 0, newItem);
      _sections = [..._sections];
      dispatch();
      return;
    }
  }
  // Fallback: append to last section
  _sections[_sections.length - 1]?.items.push(newItem);
  _sections = [..._sections];
  dispatch();
}

/**
 * Append a new item to the end of a named section.
 */
export function addItemToSection(newItem: MnItem, sectionTitle: string): void {
  const sect = _sections.find(s => s.title === sectionTitle);
  if (sect) {
    sect.items.push(newItem);
  } else {
    _sections[_sections.length - 1]?.items.push(newItem);
  }
  _sections = [..._sections];
  dispatch();
}

/**
 * Insert a new section before or after the target section.
 */
export function addSection(newSect: MnSect, targetTitle: string, part: SplPart): void {
  const tIdx = _sections.findIndex(s => s.title === targetTitle);
  const at   = tIdx === -1
    ? _sections.length
    : part === 'start' ? tIdx : tIdx + 1;
  _sections.splice(at, 0, newSect);
  _sections = [..._sections];
  dispatch();
}

/**
 * Append a new section at the very end of the list.
 */
export function appendSection(newSect: MnSect): void {
  _sections = [..._sections, newSect];
  dispatch();
}

// ── edt:save → DB sync listener ───────────────────────────────────────────
// Set up once at module load time. Fires API PATCH on every edit save.

if (typeof document !== 'undefined') {
  document.addEventListener('edt:save', (e: Event) => {
    const d = (e as CustomEvent<{
      id:     string;
      type:   string;
      fields: Record<string, string>;
    }>).detail;
    if (!d) return;

    if (d.type === 'item') {
      const p: Record<string, string> = {};
      if (d.fields['name']  !== undefined) p['name']  = d.fields['name'];
      if (d.fields['desc']  !== undefined) p['dsc']   = d.fields['desc'];
      if (d.fields['price'] !== undefined) p['price'] = d.fields['price'].replace(/\D/g, '') || '0';
      apiPatchItem(d.id, p);
    } else if (d.type === 'section') {
      const newTitle = d.fields['title'];
      if (newTitle !== undefined) {
        const dbId = getSectDbId(d.id);
        if (dbId) apiPatchSect(dbId, newTitle);
        updSectTitle(d.id, newTitle);
      }
    }
  });
}
