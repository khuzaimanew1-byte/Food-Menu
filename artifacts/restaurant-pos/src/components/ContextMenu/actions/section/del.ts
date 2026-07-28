import { delSection, getSectDbId } from '@/lib/menu/menuStore';
import { apiDelSect }               from '@/lib/menu/apiSync';

/** Delete section (and all its items) — removes from local store and DB. */
export function deleteSection(id: string | null): void {
  if (!id) return;
  const dbId = getSectDbId(id);
  if (dbId) apiDelSect(dbId);
  delSection(id);
}
