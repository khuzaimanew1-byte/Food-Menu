// ── splHint — resolve the correct drop-target element and compute part ────
// Single source of truth for before/after hint logic used by both the
// context-menu open path (visual hint) and the paste action path (reorder).
//
// Rules:
//   item move   → target must be an item   (horizontal split 'h')
//   section move → target must be a section (vertical   split 'v')
//                  If the pointer landed on an item, walk up to its parent section.

import { getPartAtPoint } from './spl';
import type { SplPart }   from './spl';

export interface HintResult {
  part:     SplPart;
  targetEl: HTMLElement;
  /** Resolved data-id — may differ from the original when an item was promoted to its section. */
  targetId: string;
}

export function resolveHint(
  area:       string,
  el:         HTMLElement,
  x:          number,
  y:          number,
  movingType: 'item' | 'section',
): HintResult | null {
  let targetEl: HTMLElement = el;

  // Section move on an item → promote to the item's parent section
  if (movingType === 'section' && area === 'item') {
    const sect = el.closest<HTMLElement>('[data-area="section"]');
    if (!sect) return null;
    targetEl = sect;
  }

  const dir  = movingType === 'item' ? 'h' : 'v';
  const part = getPartAtPoint(targetEl, x, y, dir);
  const targetId = targetEl.dataset.id ?? '';
  return { part, targetEl, targetId };
}
