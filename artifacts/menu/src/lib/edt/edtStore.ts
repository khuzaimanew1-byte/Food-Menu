// ── Edit store — single source of truth for active edit target ───────────
// No React dependency — plain TS module, usable anywhere.

export type EdtType = 'item' | 'section';

interface EdtDetail {
  id: string;
  type: EdtType;
}

let _activeId:   string | null  = null;
let _activeType: EdtType | null = null;
let _dirty = false;

function _dispatch(detail: EdtDetail | null) {
  document.dispatchEvent(new CustomEvent<EdtDetail | null>('edt:change', { detail }));
}

function _getActiveEl(): Element | null {
  if (!_activeId) return null;
  return document.querySelector(
    `[data-area="${_activeType}"][data-id="${CSS.escape(_activeId)}"]`
  );
}

// ── Public API ────────────────────────────────────────────────────────────

/** Activate an element. Same id → toggle off. */
export function activate(id: string, type: EdtType) {
  if (_activeId === id) { deactivate(); return; }
  _activeId   = id;
  _activeType = type;
  _dirty = false;
  _dispatch({ id, type });
}

/** Deactivate immediately — no confirmation, no save. */
export function deactivate() {
  if (!_activeId) return;
  _activeId   = null;
  _activeType = null;
  _dirty = false;
  _dispatch(null);
}

/**
 * Capture current DOM text from [data-edt-field] elements, dispatch
 * edt:save so components can persist them, then deactivate.
 */
export function saveAndDeactivate() {
  const el = _getActiveEl();
  const fields: Record<string, string> = {};
  if (el) {
    el.querySelectorAll<HTMLElement>('[data-edt-field]').forEach((node) => {
      fields[node.dataset.edtField!] = node.textContent ?? '';
    });
  }
  if (_activeId) {
    document.dispatchEvent(
      new CustomEvent('edt:save', { detail: { id: _activeId, type: _activeType, fields } })
    );
  }
  deactivate();
}

/** Mark that the active element has unsaved changes. */
export function setDirty(v = true) { _dirty = v; }
export function isDirty()          { return _dirty; }

/**
 * Deactivate if clean; dispatch edt:confirm-needed if dirty so the
 * confirmation modal can intercept.
 */
export function requestDeactivate() {
  if (_dirty) {
    document.dispatchEvent(new CustomEvent('edt:confirm-needed'));
  } else {
    deactivate();
  }
}

export function getActive() {
  return { activeId: _activeId, activeType: _activeType };
}
