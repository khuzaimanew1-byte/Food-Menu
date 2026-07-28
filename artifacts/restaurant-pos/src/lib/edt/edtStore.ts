// ── Edit store — multi-active edit target registry ────────────────────────
// Supports any number of simultaneously active elements (e.g. section title
// + default item when a new section is added).
// No React dependency — plain TS module, usable anywhere.

export type EdtType = 'item' | 'section';

export interface EdtActiveEntry { id: string; type: EdtType; }

interface EdtDetail { active: EdtActiveEntry[]; }

// Multi-active: id → type
const _active = new Map<string, EdtType>();

// Per-element dirty tracking: only ids that have unsaved changes.
const _dirtyIds = new Set<string>();

// Ids waiting for confirm-modal resolution (subset of _active).
let _pendingIds: string[] = [];

function _dispatch() {
  const active = Array.from(_active.entries()).map(([id, type]) => ({ id, type }));
  document.dispatchEvent(new CustomEvent<EdtDetail>('edt:change', { detail: { active } }));
}

function _getEl(id: string, type: EdtType): Element | null {
  return document.querySelector(
    `[data-area="${type}"][data-id="${CSS.escape(id)}"]`,
  );
}

// ── Public API ────────────────────────────────────────────────────────────

/** Activate an element. Same id → toggle off. */
export function activate(id: string, type: EdtType) {
  if (_active.has(id)) {
    _active.delete(id);
    _dirtyIds.delete(id);
  } else {
    _active.set(id, type);
  }
  _dispatch();
}

/** Deactivate a specific id, or all active elements when called with no arg. */
export function deactivate(id?: string) {
  if (id !== undefined) {
    _active.delete(id);
    _dirtyIds.delete(id);
  } else {
    _active.clear();
    _dirtyIds.clear();
  }
  _dispatch();
}

/**
 * Collect DOM text from [data-edt-field] nodes, dispatch edt:save for each
 * targeted element, then deactivate them.
 * Pass an array of ids to save only those; pass nothing to save ALL active.
 */
export function saveAndDeactivate(ids?: string[]) {
  const targets: Array<[string, EdtType]> = ids
    ? ids.flatMap(id => _active.has(id) ? [[id, _active.get(id)!]] : [])
    : Array.from(_active.entries());

  for (const [eid, etype] of targets) {
    const el = _getEl(eid, etype);
    const fields: Record<string, string> = {};
    if (el) {
      el.querySelectorAll<HTMLElement>('[data-edt-field]').forEach((node) => {
        fields[node.dataset.edtField!] = node.textContent ?? '';
      });
    }
    document.dispatchEvent(
      new CustomEvent('edt:save', { detail: { id: eid, type: etype, fields } }),
    );
    _active.delete(eid);
    _dirtyIds.delete(eid);
  }
  _dispatch();
}

/**
 * Mark a specific element as having unsaved changes.
 * Called by components (setDirty(id)) and edtInit (_onInput with detected id).
 */
export function setDirty(id: string, v = true) {
  if (v) _dirtyIds.add(id);
  else   _dirtyIds.delete(id);
}

/** True if ANY currently active element has unsaved changes. */
export function isDirty()      { return _dirtyIds.size > 0; }
export function hasAnyActive() { return _active.size > 0; }
export function isActiveId(id: string) { return _active.has(id); }

/**
 * Per-component deactivation request.
 * Only checks dirty state for the specific ids being deactivated — not global.
 * If any of those ids are dirty → store as pending, dispatch edt:confirm-needed.
 * If all clean → deactivate only those ids immediately.
 */
export function requestDeactivate(ids: string[]) {
  if (!ids.length) return;
  const hasDirty = ids.some(id => _dirtyIds.has(id));
  if (hasDirty) {
    _pendingIds = ids;
    document.dispatchEvent(new CustomEvent('edt:confirm-needed'));
  } else {
    ids.forEach(id => { _active.delete(id); _dirtyIds.delete(id); });
    _dispatch();
  }
}

/**
 * Called by EdtCnf "Save" button.
 * Saves + deactivates only the pending ids (not all active elements).
 */
export function confirmSave() {
  const ids = _pendingIds.length ? _pendingIds : Array.from(_active.keys());
  _pendingIds = [];
  saveAndDeactivate(ids);
}

/**
 * Called by EdtCnf "×" (discard) button.
 * Discards + deactivates only the pending ids.
 */
export function confirmDiscard() {
  const ids = _pendingIds.length ? _pendingIds : Array.from(_active.keys());
  _pendingIds = [];
  ids.forEach(id => { _active.delete(id); _dirtyIds.delete(id); });
  _dispatch();
}

/**
 * Backward-compat accessor used by EdtCnf for modal positioning.
 * Returns the first item-type active entry (preferred), or first overall.
 */
export function getActive(): {
  activeId:   string | null;
  activeType: EdtType | null;
  all:        EdtActiveEntry[];
} {
  const all   = Array.from(_active.entries()).map(([id, type]) => ({ id, type }));
  const first = all.find(a => a.type === 'item') ?? all[0];
  return {
    activeId:   first?.id   ?? null,
    activeType: first?.type ?? null,
    all,
  };
}
