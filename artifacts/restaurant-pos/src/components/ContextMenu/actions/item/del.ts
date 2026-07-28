import { delItem }   from '@/lib/menu/menuStore';
import { apiDelItem } from '@/lib/menu/apiSync';

/** Delete item — remove from local store and DB. */
export function deleteItem(id: string | null): void {
  if (!id) return;
  apiDelItem(id);   // fire before local delete while id still resolves
  delItem(id);
}
