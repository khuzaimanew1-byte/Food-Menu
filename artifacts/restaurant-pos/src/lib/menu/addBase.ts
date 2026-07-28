// ── addBase — shared factory + post-add wiring for add-item / add-section ─
// All add actions call makeItem / makeSection to get default objects, then
// call afterAdd to navigate and activate edit mode.
// Nothing here touches the DOM directly; it dispatches events.
//
// Default field values live in each component (MnItm, MnHdg), NOT here.
// makeItem only generates a unique ID; makeSection adds a title for uniqueness
// (title is used as data-id so must stay unique across all sections).

import type { MnItem } from '@/data/menu';
import { getSections }            from './menuStore';
import type { MnSect }            from './menuStore';
import { paginateMenuSections }   from './paginate';
import { activate }               from '@/lib/edt/edtStore';

// ── Unique ID counter ─────────────────────────────────────────────────────
// Starts above the seed data range (1–30) and increments monotonically.
let _uid = 1000;
function nextId(): number { return ++_uid; }

// ── Default object factories ──────────────────────────────────────────────

/**
 * Create a new MnItem with only an id.
 * All display defaults (name, description, price) are defined in MnItm component.
 */
export function makeItem(): MnItem {
  return { id: nextId() };
}

/**
 * Create a new MnSect with a unique title and no items (heading only).
 * Title uniqueness prevents collisions in menuStore (title is used as data-id).
 */
export function makeSection(): MnSect {
  const existing = getSections().map(s => s.title);
  let title = 'New Section';
  if (existing.includes(title)) {
    let n = 2;
    while (existing.includes(`New Section ${n}`)) n++;
    title = `New Section ${n}`;
  }
  return { title, items: [] };
}

// ── Post-add navigation + edit activation ─────────────────────────────────

/**
 * After inserting a new item/section into the store:
 *   1. Re-paginate to find which page it landed on.
 *   2. Dispatch 'pg:goto' so MnPg navigates there (deferred one rAF so
 *      React has processed the 'menu:change' state update first).
 *   3. Activate edit mode on the new element (deferred a second rAF so
 *      the DOM node exists before edtStore queries it).
 *      For sections: also activates the default item simultaneously,
 *      so both title and first item enter edit mode together.
 *
 * @param id    String form of the item id (numeric) or section title.
 * @param type  'item' | 'section'
 */
export function afterAdd(id: string, type: 'item' | 'section'): void {
  // Find the content-page index (1-based pgNum, same as MnPg's curPg for content).
  const pages = paginateMenuSections(getSections());
  let targetPg = 1;

  if (type === 'item') {
    const numId = Number(id);
    outer: for (const page of pages) {
      for (const sect of page.sections) {
        if (sect.items.some(it => it.id === numId)) {
          targetPg = page.pgNum;
          break outer;
        }
      }
    }
  } else {
    for (const page of pages) {
      if (page.sections.some(s => s.title === id)) {
        targetPg = page.pgNum;
        break;
      }
    }
  }

  // rAF 1: let React flush the 'menu:change' setPages update, then navigate.
  requestAnimationFrame(() => {
    document.dispatchEvent(
      new CustomEvent('pg:goto', { detail: { page: targetPg } }),
    );

    // rAF 2: let the navigation render complete, then activate edit mode.
    requestAnimationFrame(() => {
      activate(id, type);
    });
  });
}
