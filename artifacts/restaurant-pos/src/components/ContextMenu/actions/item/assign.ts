// ── assign — dispatch asg:open event from context menu ───────────────────
// Looks up item name from menuStore so the modal can display it.

import { getSections } from '@/lib/menu/menuStore';

export function assignItem(id: string | null): void {
  if (!id) return;

  // Resolve item name for the modal title
  let itemName = '';
  for (const sect of getSections()) {
    const item = sect.items.find(it => String(it.id) === id);
    if (item) { itemName = item.name ?? ''; break; }
  }

  document.dispatchEvent(new CustomEvent('asg:open', {
    detail: { itemId: id, itemName },
  }));
}
