// ── addSectAfterSection (from section context) ─────────────────────────────
// Resolves before/after via vertical split on the right-clicked section,
// inserts a default section (with one default item), then navigates + edits.

import { getLastPointerPos }               from '@/lib/mv/mvStore';
import { resolveHint }                     from '@/lib/spl/splHint';
import { addSection as storeAddSection }   from '@/lib/menu/menuStore';
import { makeSection, afterAdd }           from '@/lib/menu/addBase';

export function addSectAfterSection(id: string | null): void {
  if (!id) return;
  const sectEl = document.querySelector<HTMLElement>(
    `[data-area="section"][data-id="${CSS.escape(id)}"]`,
  );
  if (!sectEl) return;

  const { x, y } = getLastPointerPos();
  const hint      = resolveHint('section', sectEl, x, y, 'section'); // 'v' vertical split
  if (!hint) return;

  const newSect = makeSection();
  storeAddSection(newSect, hint.targetId, hint.part);
  afterAdd(newSect.title, 'section');
}
