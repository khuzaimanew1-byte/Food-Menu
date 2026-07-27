// ── Context menu dispatcher ───────────────────────────────────────────────
// Single place that maps (area, id, optId) triples to action handlers.
// Paste path (move mode active) is handled here before area dispatch so
// every "Paste Here" click is caught centrally.

import type { CtxArea } from '../contextMenuConfig';

// ── Item actions ──────────────────────────────────────────────────────────
import { editItem }        from './item/edit';
import { addItem }         from './item/addItem';
import { moveItem }        from './item/move';
import { addSectFromItem } from './item/addSect';
import { assignItem }      from './item/assign';
import { deleteItem }      from './item/del';

// ── Section actions ───────────────────────────────────────────────────────
import { editSection }         from './section/edit';
import { addItemToSection }    from './section/addItem';
import { moveSection }         from './section/move';
import { addSectAfterSection } from './section/addSect';
import { deleteSection }       from './section/del';

// ── Page actions ──────────────────────────────────────────────────────────
import { addSectToPage }  from './page/addSect';
import { shapeSquare }    from './page/shpSq';
import { shapeInfCastle } from './page/shpInf';
import { shapePlaque }    from './page/shpPlq';

// ── Move / paste globals ───────────────────────────────────────────────────
import { getMoving, getLastPointerPos, deactivate as mvDeactivate } from '@/lib/mv/mvStore';
import { reorderItem, reorderSection }                               from '@/lib/menu/menuStore';
import { getPartAtPoint }                                            from '@/lib/spl/spl';

export function dispatchCtxAction(
  area:  CtxArea,
  id:    string | null,
  optId: string,
): void {
  const { movingId, movingType } = getMoving();

  // ── Cancel move — single-option menu on the source element ───────────
  if (optId === 'cancel-move') { mvDeactivate(); return; }

  // ── Paste path — move mode is active ──────────────────────────────────
  // move-item / move-section button becomes "Paste Here" while a move is
  // in progress. Vertical split: top half = insert before, bottom = after.
  if (movingId && id && (optId === 'move-item' || optId === 'move-section')) {
    if (movingId === id) { mvDeactivate(); return; }   // same element → cancel

    const targetEl = document.querySelector<HTMLElement>(
      `[data-area="${area}"][data-id="${CSS.escape(id)}"]`,
    );
    if (targetEl) {
      const { x, y } = getLastPointerPos();
      // Item  → horizontal split ('h'): left half = before, right half = after
      // Section → vertical split   ('v'): top  half = before, bottom half = after
      const part = getPartAtPoint(targetEl, x, y, movingType === 'item' ? 'h' : 'v');

      if (movingType === 'item')    reorderItem(Number(movingId), Number(id), part);
      else                          reorderSection(movingId, id, part);
    }
    mvDeactivate();
    return;
  }

  // ── Normal action path ─────────────────────────────────────────────────
  if (area === 'item') {
    switch (optId) {
      case 'edit':        return editItem(id);
      case 'add-item':    return addItem(id);
      case 'move-item':   return moveItem(id);
      case 'add-section': return addSectFromItem(id);
      case 'assign':      return assignItem(id);
      case 'delete':      return deleteItem(id);
    }
  }

  if (area === 'section') {
    switch (optId) {
      case 'edit':         return editSection(id);
      case 'add-item':     return addItemToSection(id);
      case 'move-section': return moveSection(id);
      case 'add-section':  return addSectAfterSection(id);
      case 'delete':       return deleteSection(id);
    }
  }

  if (area === 'page') {
    switch (optId) {
      case 'add-section': return addSectToPage(id);
      case 'shape-sq':    return shapeSquare(id);
      case 'shape-inf':   return shapeInfCastle(id);
      case 'shape-plq':   return shapePlaque(id);
    }
  }

  console.warn('[ctx] unhandled action', area, optId, id);
}
