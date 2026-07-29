// ── delExec — single SSOT for all confirmed deletes ──────────────────────
// Called only after user confirms via DelCnf modal.
// Both item and section delete go through here → trash cache always applies.

import { delItem, delSection, getSections, getSectDbId } from '@/lib/menu/menuStore';
import { apiDelItem, apiDelSect }                         from '@/lib/menu/apiSync';
import { pushToTrash }                                    from '@/lib/trsh/trshStr';

export type DelType = 'item' | 'section';

export function execDel(id: string, type: DelType): void {
  if (type === 'item') {
    const item = getSections().flatMap(s => s.items).find(it => it.id === id);
    if (item) pushToTrash({ id, type: 'item', data: item });
    apiDelItem(id);
    delItem(id);
  } else {
    const sect = getSections().find(s => s.title === id);
    if (sect) pushToTrash({ id, type: 'section', data: sect });
    const dbId = getSectDbId(id);
    if (dbId) apiDelSect(dbId);
    delSection(id);
  }
}
