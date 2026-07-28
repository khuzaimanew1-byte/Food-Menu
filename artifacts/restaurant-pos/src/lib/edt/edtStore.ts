// ── Edit store — multi-active edit target registry ────────────────────────
// Supports any number of simultaneously active elements (e.g. section title
// + default item when a new section is added).
// No React dependency — plain TS module, usable anywhere.

export type EdtType = 'item' | 'section';

export interface EdtActiveEntry { id: string; type: EdtType; }

interface EdtDetail { active: EdtActiveEntry[]; }

// Multi-active: id → type
const _active = new Map<string, EdtType>();
let _dirty = false;

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
  } else {
    _active.set(id, type);
  }
  _dispatch();
}

/** Deactivate a specific id, or all active elements when called with no arg. */
export function deactivate(id?: string) {
  if (id !== undefined) {
    _active.delete(id);
  } else {
    _active.clear();
  }
  if (_active.size === 0) _dirty = false;
  _dispatch();
}

/**
 * Collect DOM text from [data-edt-field] nodes, dispatch edt:save for each
 * targeted element, then deactivate them.
 * Pass no arg to save & deactivate ALL active elements (used by confirm modal).
 */
export function saveAndDeactivate(id?: string) {
  const targets: Array<[string, EdtType]> = id !== undefined
    ? (_active.has(id) ? [[id, _active.get(id)!]] : [])
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
  }

  if (_active.size === 0) _dirty = false;
  _dispatch();
}

/** Mark that any active element has unsaved changes. */
export function setDirty(v = true) { _dirty = v; }
export function isDirty()          { return _dirty; }
export function hasAnyActive()     { return _active.size > 0; }
export function isActiveId(id: string) { return _active.has(id); }

/**
 * Deactivate the given ids:
 * - If global dirty → dispatch edt:confirm-needed (modal saves ALL active).
 * - If clean → deactivate only those ids immediately.
 */
export function requestDeactivate(ids: string[]) {
  if (!ids.length) return;
  if (_dirty) {
    document.dispatchEvent(new CustomEvent('edt:confirm-needed'));
  } else {
    ids.forEach(id => _active.delete(id));
    if (_active.size === 0) _dirty = false;
    _dispatch();
  }
}

/**
 * Backward-compat accessor used by EdtCnf for modal positioning.
 * Returns the first item-type active entry (preferred), or first overall.
 * Also exposes `all` for consumers that need the full list.
 */
export function getActive(): {
  activeId:   string | null;
  activeType: EdtType | null;
  all:        EdtActiveEntry[];
} {
  const all     = Array.from(_active.entries()).map(([id, type]) => ({ id, type }));
  const first   = all.find(a => a.type === 'item') ?? all[0];
  return {
    activeId:   first?.id   ?? null,
    activeType: first?.type ?? null,
    all,
  };
}
