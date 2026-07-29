import { delItem, getSections } from '@/lib/menu/menuStore';
import { apiDelItem }           from '@/lib/menu/apiSync';
import { pushToTrash }          from '@/lib/trsh/trshStr';

/** Delete item — snapshot to 7-day trash, then remove from store + DB. */
export function deleteItem(id: string | null): void {
  if (!id) return;
  const item = getSections().flatMap(s => s.items).find(it => it.id === id);
  if (item) pushToTrash({ id, type: 'item', data: item });
  apiDelItem(id);   // fire before local delete while id still resolves
  delItem(id);
}
