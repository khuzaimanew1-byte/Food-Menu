import type { CtxArea } from '../contextMenuConfig';

import { editItem }        from './item/edit';
import { addItem }         from './item/addItem';
import { moveItem }        from './item/move';
import { addSectFromItem } from './item/addSect';
import { assignItem }      from './item/assign';
import { deleteItem }      from './item/del';

import { editSection }         from './section/edit';
import { addItemToSection }    from './section/addItem';
import { moveSection }         from './section/move';
import { addSectAfterSection } from './section/addSect';
import { deleteSection }       from './section/del';

import { addSectToPage }  from './page/addSect';
import { shapeSquare }    from './page/shpSq';
import { shapeInfCastle } from './page/shpInf';
import { shapePlaque }    from './page/shpPlq';

import { getMoving, getLastPointerPos, deactivate as mvDeactivate } from '@/lib/mv/mvStore';
import { reorderItem, reorderSection }                               from '@/lib/menu/menuStore';
import { resolveHint }                                               from '@/lib/spl/splHint';

export function dispatchCtxAction(
  area:  CtxArea,
  id:    string | null,
  optId: string,
): void {
  const { movingId, movingType } = getMoving();

  if (optId === 'cancel-move') { mvDeactivate(); return; }

  if (movingId && id && (optId === 'move-item' || optId === 'move-section')) {
    if (movingId === id) { mvDeactivate(); return; }

    const rawEl = document.querySelector<HTMLElement>(
      `[data-area="${area}"][data-id="${CSS.escape(id)}"]`,
    );
    if (rawEl) {
      const { x, y } = getLastPointerPos();
      const result = resolveHint(area, rawEl, x, y, movingType);
      if (result) {
        const { part, targetId } = result;
        if (movingType === 'item') reorderItem(Number(movingId), Number(targetId), part);
        else                       reorderSection(movingId, targetId, part);
      }
    }
    mvDeactivate();
    return;
  }

  if (area === 'item') {
    switch (optId) {
      case 'edit':        return editItem(id);
      case 'add-item':    return addItem(id);
      case 'move-item':   return moveItem(id);
      case 'move-section': {
        const itemEl = id
          ? document.querySelector<HTMLElement>(`[data-area="item"][data-id="${CSS.escape(id)}"]`)
          : null;
        const sectEl = itemEl?.closest<HTMLElement>('[data-area="section"]');
        return moveSection(sectEl?.dataset.id ?? null);
      }
      case 'add-section': return addSectFromItem(id);
      case 'assign':      return assignItem(id);
      case 'delete':      return deleteItem(id);
    }
  }

  if (area === 'section') {
    switch (optId) {
      case 'edit':         return editSection(id);
      case 'add-item':     return addItemToSection(id);
      case 'move-item':    return moveItem(id);
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

}
