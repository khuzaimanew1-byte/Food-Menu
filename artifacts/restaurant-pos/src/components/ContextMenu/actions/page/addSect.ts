// ── addSectToPage (from page/blank-area context) ───────────────────────────
// Page blank-area right-click → always appends at end of all sections.
// No split needed; id is the page number (not relevant for append).

import { appendSection as storeAppendSection } from '@/lib/menu/menuStore';
import { makeSection, afterAdd }               from '@/lib/menu/addBase';

export function addSectToPage(_id: string | null): void {
  const newSect = makeSection();
  storeAppendSection(newSect);
  afterAdd(newSect.title, 'section');
}
