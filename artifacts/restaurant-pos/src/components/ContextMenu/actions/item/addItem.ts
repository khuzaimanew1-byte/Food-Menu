// ── addItem (from item context) ────────────────────────────────────────────
// Resolves before/after via horizontal split on the right-clicked item,
// inserts a default item, then navigates + activates edit mode.

import { getLastPointerPos }              from '@/lib/mv/mvStore';
import { resolveHint }                    from '@/lib/spl/splHint';
import { addItem as storeAddItem }        from '@/lib/menu/menuStore';
import { makeItem, afterAdd }             from '@/lib/menu/addBase';

export function addItem(id: string | null): void {
  if (!id) return;
  const itemEl = document.querySelector<HTMLElement>(
    `[data-area="item"][data-id="${CSS.escape(id)}"]`,
  );
  if (!itemEl) return;

  const { x, y } = getLastPointerPos();
  const hint      = resolveHint('item', itemEl, x, y, 'item'); // 'h' horizontal split
  const part      = hint?.part     ?? 'end';
  const targetId  = hint?.targetId ?? id;

  const newItem = makeItem();
  storeAddItem(newItem, Number(targetId), part);
  afterAdd(String(newItem.id), 'item');
}
