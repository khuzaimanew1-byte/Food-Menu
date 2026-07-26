// Global upload initializer — call once at app start.
//
// Sets up:
//   1. Click delegation: .avt click inside .edit-mode ancestor → upldStore.pick(id)
//   2. Drag-drop listeners via initDrop()
//   3. beforeunload cleanup for all object URLs

import { upldStore } from './upldStore';
import { initDrop }  from './dropReg';
import { revokeAll } from './upld';

let inited = false;

export function initUpld(): void {
  if (inited) return;
  inited = true;

  // ── Click-to-pick: single delegation on document ───────────────────────
  // Match clicks on/inside .avt whose nearest [data-item-id] ancestor
  // is inside a .edit-mode container. Stops propagation of the React
  // synthetic event is handled in the MnItm mic-avt onClick; this listener
  // only needs to call pick() via the native event that reaches document.
  document.addEventListener('click', (e) => {
    const avt = (e.target as Element).closest('.avt');
    if (!avt) return;
    const itemEl = avt.closest('[data-item-id]');
    if (!itemEl || !itemEl.closest('.edit-mode')) return;
    upldStore.pick(itemEl.getAttribute('data-item-id')!);
  });

  initDrop();
  window.addEventListener('beforeunload', revokeAll);
}
