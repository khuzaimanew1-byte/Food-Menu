// ── Context menu action router ────────────────────────────────────────────
// Single place that maps (area, id, optId) triples to store actions.
// App.tsx passes this as `onSelect` to <ContextMenu />.

import { activate as edtActivate }                        from '@/lib/edt/edtStore';
import { activate as mvActivate, deactivate as mvDeactivate,
         getMoving, getLastPointerPos }                    from '@/lib/mv/mvStore';
import { reorderItem, reorderSection }                    from '@/lib/menu/menuStore';
import { getPartAtPoint }                                 from '@/lib/spl/spl';
import type { CtxArea }                                   from './contextMenuConfig';

export function dispatchCtxAction(
  area:  CtxArea,
  id:    string | null,
  optId: string,
): void {
  const { movingId, movingType } = getMoving();

  // ── Paste path ──────────────────────────────────────────────────────────
  // Move mode is active and the user clicked "Paste Here" (which shows as
  // 'move-item' or 'move-section' option id on the target element).
  if (movingId && id && (optId === 'move-item' || optId === 'move-section')) {

    // Same element → cancel the move (user right-clicked the source itself)
    if (movingId === id) { mvDeactivate(); return; }

    // Locate the target element to measure the click position against it
    const targetEl = document.querySelector<HTMLElement>(
      `[data-area="${area}"][data-id="${CSS.escape(id)}"]`,
    );

    if (targetEl) {
      const { x, y } = getLastPointerPos();
      // Reuse split logic: vertical axis — top half = start = before,
      //                                    bottom half = end = after.
      // getPartAtPoint is the single call site; logic lives in spl.ts.
      const part = getPartAtPoint(targetEl, x, y, 'v');

      if (movingType === 'item') {
        reorderItem(Number(movingId), Number(id), part);
      } else {
        reorderSection(movingId, id, part);
      }
    }

    mvDeactivate();
    return;
  }

  // ── Normal action path ──────────────────────────────────────────────────
  switch (optId) {
    case 'edit':
      if (id) edtActivate(id, area === 'section' ? 'section' : 'item');
      break;

    case 'move-item':
      if (id) mvActivate(id, 'item');
      break;

    case 'move-section':
      if (id) mvActivate(id, 'section');
      break;

    // add-item, add-section, delete, assign, shapes — not yet implemented;
    // handled silently so the menu still closes without throwing.
    default:
      break;
  }
}
