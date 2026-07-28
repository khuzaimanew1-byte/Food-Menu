// ── splHint — resolve the correct drop-target element and compute part ────
// Single source of truth for before/after hint logic used by:
//   • context-menu open path  (visual hint icon)
//   • paste action path       (reorder)
//   • add-item / add-section  (insert position)
//
// Rules:
//   opType 'item'    → target must be an item   (horizontal split 'h')
//   opType 'section' → target must be a section (vertical   split 'v')
//                      If the pointer landed on an item, walk up to its
//                      parent section automatically.

import { getPartAtPoint } from './spl';
import type { SplPart }   from './spl';

export interface HintResult {
  part:     SplPart;
  targetEl: HTMLElement;
  /** Resolved data-id — may differ from the original when an item was promoted to its section. */
  targetId: string;
}

/**
 * @param area    data-area value of the element the pointer is over ('item' | 'section' | 'page')
 * @param el      The DOM element at the pointer position (matched by data-area + data-id)
 * @param x       Pointer X in viewport px
 * @param y       Pointer Y in viewport px
 * @param opType  'item' → horizontal split on item
 *                'section' → vertical split on section (promotes item → parent section)
 */
export function resolveHint(
  area:   string,
  el:     HTMLElement,
  x:      number,
  y:      number,
  opType: 'item' | 'section',
): HintResult | null {
  let targetEl: HTMLElement = el;

  // Section op on an item → promote to the item's parent section
  if (opType === 'section' && area === 'item') {
    const sect = el.closest<HTMLElement>('[data-area="section"]');
    if (!sect) return null;
    targetEl = sect;
  }

  const dir      = opType === 'item' ? 'h' : 'v';
  const part     = getPartAtPoint(targetEl, x, y, dir);
  const targetId = targetEl.dataset.id ?? '';
  return { part, targetEl, targetId };
}
