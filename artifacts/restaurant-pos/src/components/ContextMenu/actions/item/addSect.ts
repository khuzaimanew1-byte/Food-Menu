// ── addSectFromItem (from item context) ────────────────────────────────────
// resolveHint with opType='section' auto-promotes the item element to its
// parent section, then applies a vertical split to place the new section
// before or after the parent section.

import { getLastPointerPos }               from '@/lib/mv/mvStore';
import { resolveHint }                     from '@/lib/spl/splHint';
import { addSection as storeAddSection }   from '@/lib/menu/menuStore';
import { makeSection, afterAdd }           from '@/lib/menu/addBase';

export function addSectFromItem(id: string | null): void {
  if (!id) return;
  const itemEl = document.querySelector<HTMLElement>(
    `[data-area="item"][data-id="${CSS.escape(id)}"]`,
  );
  if (!itemEl) return;

  const { x, y } = getLastPointerPos();
  // opType 'section' → item element promoted to parent section inside resolveHint
  const hint = resolveHint('item', itemEl, x, y, 'section');
  if (!hint) return;

  const newSect = makeSection();
  storeAddSection(newSect, hint.targetId, hint.part);
  afterAdd(newSect.title, 'section');
}
