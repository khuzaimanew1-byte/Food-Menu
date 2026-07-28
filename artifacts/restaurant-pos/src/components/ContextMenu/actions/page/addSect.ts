// ── addSectToPage (from page/blank-area context) ───────────────────────────
// Page blank-area right-click → always appends at end of all sections.

import { appendSection as storeAppendSection, updSectDbId } from '@/lib/menu/menuStore';
import { makeSection, afterAdd }               from '@/lib/menu/addBase';
import { apiCreateSect }                       from '@/lib/menu/apiSync';

export function addSectToPage(_id: string | null): void {
  const newSect = makeSection();
  storeAppendSection(newSect);
  afterAdd(newSect.title, 'section');

  // Persist to DB
  apiCreateSect(newSect.title).then(dbId => {
    if (dbId) updSectDbId(newSect.title, dbId);
  });
}
