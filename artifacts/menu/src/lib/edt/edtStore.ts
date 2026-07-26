// ── Edit store — single source of truth for active edit target ───────────
// No React dependency — plain TS module, usable anywhere.

export type EdtType = 'item' | 'section';

interface EdtDetail {
  id: string;
  type: EdtType;
}

let _activeId:   string | null = null;
let _activeType: EdtType | null = null;

function _dispatch(detail: EdtDetail | null) {
  document.dispatchEvent(new CustomEvent<EdtDetail | null>('edt:change', { detail }));
}

/** Activate an element. If same id → toggle off. */
export function activate(id: string, type: EdtType) {
  if (_activeId === id) {
    deactivate();
    return;
  }
  _activeId   = id;
  _activeType = type;
  _dispatch({ id, type });
}

/** Deactivate without confirmation. */
export function deactivate() {
  if (!_activeId) return;
  _activeId   = null;
  _activeType = null;
  _dispatch(null);
}

export function getActive() {
  return { activeId: _activeId, activeType: _activeType };
}
