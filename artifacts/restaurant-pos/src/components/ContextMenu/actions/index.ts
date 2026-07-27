import type { CtxArea } from '../contextMenuConfig';

import { editItem }        from './item/edit';
import { addItem }         from './item/addItem';
import { moveItem }        from './item/move';
import { addSectFromItem } from './item/addSect';
import { assignItem }      from './item/assign';
import { deleteItem }      from './item/del';

import { editSection }        from './section/edit';
import { addItemToSection }   from './section/addItem';
import { moveSection }        from './section/move';
import { addSectAfterSection} from './section/addSect';
import { deleteSection }      from './section/del';

import { addSectToPage }  from './page/addSect';
import { shapeSquare }    from './page/shpSq';
import { shapeInfCastle } from './page/shpInf';
import { shapePlaque }    from './page/shpPlq';

// ── Dispatch ──────────────────────────────────────────────────────────────────
// Called by ContextMenu's onSelect. Routes (area, id, optId) to the correct
// action handler. Each handler lives in its own file.

export function dispatchCtxAction(
  area:  CtxArea,
  id:    string | null,
  optId: string,
): void {
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
