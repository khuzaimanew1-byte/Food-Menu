import { getSections } from '@/lib/menu/menuStore';

// Dispatches 'del:cnf' with item name so the modal can show what's being deleted.
export function deleteItem(id: string | null): void {
  if (!id) return;
  const item = getSections().flatMap(s => s.items).find(it => it.id === id);
  document.dispatchEvent(new CustomEvent('del:cnf', {
    detail: { id, type: 'item', name: item?.name ?? 'Item' },
  }));
}
