// ── Menu store — mutable source of truth for sections + items ─────────────
// Plain TS module, no React. Dispatches 'menu:change' when order mutates.
// MnPg listens to that event and re-paginates.

import { ARBC, TURK } from '@/data/menu';
import type { MnItem } from '@/data/menu';
import type { SplPart } from '@/lib/spl/spl';

export interface MnSect {
  title: string;
  items: MnItem[];
}

// Mutable copy — never mutate the original data/menu arrays
let _sections: MnSect[] = [
  { title: 'Arabic Specialties',  items: [...ARBC] },
  { title: 'Turkish Specialties', items: [...TURK] },
];

function dispatch() {
  document.dispatchEvent(new CustomEvent('menu:change'));
}

/** Current sections in their present order. */
export function getSections(): MnSect[] {
  return _sections;
}

/**
 * Move an item before or after a target item.
 * Works across section boundaries — item is removed from its current
 * section and inserted into the target's section at the correct index.
 */
export function reorderItem(
  movingId: number,
  targetId: number,
  part:     SplPart,
): void {
  if (movingId === targetId) return;

  // Pull the moving item out of wherever it lives
  let movingItem: MnItem | undefined;
  for (const sect of _sections) {
    const idx = sect.items.findIndex(it => it.id === movingId);
    if (idx !== -1) {
      [movingItem] = sect.items.splice(idx, 1);
      break;
    }
  }
  if (!movingItem) return;

  // Find the target item and insert before ('start') or after ('end')
  let placed = false;
  for (const sect of _sections) {
    const tIdx = sect.items.findIndex(it => it.id === targetId);
    if (tIdx !== -1) {
      const at = part === 'start' ? tIdx : tIdx + 1;
      sect.items.splice(at, 0, movingItem);
      placed = true;
      break;
    }
  }

  // Safety: if target was not found (shouldn't happen), append to last section
  if (!placed) _sections[_sections.length - 1].items.push(movingItem);

  _sections = [..._sections]; // new array ref so equality checks in consumers fire
  dispatch();
}

// ── Add functions ──────────────────────────────────────────────────────────

/**
 * Insert a new item before ('start') or after ('end') the target item.
 * Works across section boundaries — inserts into whichever section owns targetId.
 */
export function addItem(newItem: MnItem, targetId: number, part: SplPart): void {
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
  _sections[_sections.length - 1].items.push(newItem);
  _sections = [..._sections];
  dispatch();
}

/**
 * Append a new item to the end of a named section.
 * Used when "Add Item" is triggered from a section-title context.
 */
export function addItemToSection(newItem: MnItem, sectionTitle: string): void {
  const sect = _sections.find(s => s.title === sectionTitle);
  if (sect) {
    sect.items.push(newItem);
  } else {
    _sections[_sections.length - 1].items.push(newItem);
  }
  _sections = [..._sections];
  dispatch();
}

/**
 * Insert a new section before ('start') or after ('end') the target section.
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
 * Used when "Add Section" is triggered from the page-area context.
 */
export function appendSection(newSect: MnSect): void {
  _sections = [..._sections, newSect];
  dispatch();
}

// ── Reorder functions ──────────────────────────────────────────────────────

/**
 * Move a whole section before or after a target section.
 * 'start' → insert before target, 'end' → insert after target.
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
    ? _sections.length              // fallback: append
    : part === 'start' ? tIdx : tIdx + 1;

  _sections.splice(at, 0, movingSect);
  _sections = [..._sections];
  dispatch();
}
