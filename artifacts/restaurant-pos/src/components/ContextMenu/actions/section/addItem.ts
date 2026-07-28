// ── addItemToSection (from section context) ────────────────────────────────
// Section-title right-click → always appends to end of that section.

import { addItemToSection as storeAddItemToSection, getSections, updItemId } from '@/lib/menu/menuStore';
import { makeItem, afterAdd }                        from '@/lib/menu/addBase';
import { apiCreateItem }                             from '@/lib/menu/apiSync';

export function addItemToSection(id: string | null): void {
  if (!id) return;
  const newItem = makeItem();
  storeAddItemToSection(newItem, id);
  afterAdd(newItem.id, 'item');

  // Persist to DB
  const sect = getSections().find(s => s.title === id);
  if (sect?.dbId) {
    apiCreateItem(sect.dbId, {}).then(realId => {
      if (realId) updItemId(newItem.id, realId);
    });
  }
}
