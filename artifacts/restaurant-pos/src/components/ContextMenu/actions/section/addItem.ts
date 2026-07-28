// ── addItemToSection (from section context) ────────────────────────────────
// Section-title right-click → always appends to end of that section.
// No split needed; position is unambiguous.

import { addItemToSection as storeAddItemToSection } from '@/lib/menu/menuStore';
import { makeItem, afterAdd }                        from '@/lib/menu/addBase';

export function addItemToSection(id: string | null): void {
  if (!id) return;
  const newItem = makeItem();
  storeAddItemToSection(newItem, id);
  afterAdd(String(newItem.id), 'item');
}
