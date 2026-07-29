import { delSection, getSectDbId, getSections } from '@/lib/menu/menuStore';
import { apiDelSect }                            from '@/lib/menu/apiSync';
import { pushToTrash }                           from '@/lib/trsh/trshStr';

/** Delete section — snapshot to 7-day trash, then remove from store + DB. */
export function deleteSection(id: string | null): void {
  if (!id) return;
  const sect = getSections().find(s => s.title === id);
  if (sect) pushToTrash({ id, type: 'section', data: sect });
  const dbId = getSectDbId(id);
  if (dbId) apiDelSect(dbId);
  delSection(id);
}
