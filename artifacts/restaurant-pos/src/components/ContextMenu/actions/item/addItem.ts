// ── addItem (from item context) ────────────────────────────────────────────
// Resolves before/after via horizontal split on the right-clicked item,
// inserts a default item, then navigates + activates edit mode.

import { getLastPointerPos }              from '@/lib/mv/mvStore';
import { resolveHint }                    from '@/lib/spl/splHint';
import { addItem as storeAddItem, getSections, updItemId } from '@/lib/menu/menuStore';
import { makeItem, afterAdd }             from '@/lib/menu/addBase';
import { apiCreateItem }                  from '@/lib/menu/apiSync';

export function addItem(id: string | null): void {
  if (!id) return;
  const itemEl = document.querySelector<HTMLElement>(
    `[data-area="item"][data-id="${CSS.escape(id)}"]`,
  );
  if (!itemEl) return;

  const { x, y } = getLastPointerPos();
  const hint      = resolveHint('item', itemEl, x, y, 'item');
  const part      = hint?.part     ?? 'end';
  const targetId  = hint?.targetId ?? id;

  const newItem = makeItem();
  storeAddItem(newItem, targetId, part);
  afterAdd(newItem.id, 'item');

  // Persist to DB: find which section now owns the new item
  const sect = getSections().find(s => s.items.some(it => it.id === newItem.id));
  if (sect?.dbId) {
    apiCreateItem(sect.dbId, {}).then(realId => {
      if (realId) updItemId(newItem.id, realId);
    });
  }
}
