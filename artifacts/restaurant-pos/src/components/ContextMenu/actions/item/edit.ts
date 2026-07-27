import { activate } from '@/lib/edt/edtStore';

/** Edit Item — activate inline edit mode for this item. */
export function editItem(id: string | null): void {
  if (id == null) return;
  activate(id, 'item');
}
