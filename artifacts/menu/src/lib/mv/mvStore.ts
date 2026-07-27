// ── Move store — single source of truth for the active move target ────────
// Mirrors edtStore.ts exactly. No React dependency — plain TS module.

export type MvType = 'item' | 'section';

interface MvDetail {
  id:   string;
  type: MvType;
}

let _movingId:   string | null = null;
let _movingType: MvType | null = null;

// Last captured pointer position — updated by mvInit on contextmenu/pointerdown
// so actions.ts can read it when the paste option is clicked.
let _lastPos = { x: 0, y: 0 };

function _dispatch(detail: MvDetail | null) {
  document.dispatchEvent(new CustomEvent<MvDetail | null>('mv:change', { detail }));
}

// ── Public API ────────────────────────────────────────────────────────────

/** Enter move mode for an item or section. Same id → cancel (toggle off). */
export function activate(id: string, type: MvType): void {
  if (_movingId === id) { deactivate(); return; }
  _movingId   = id;
  _movingType = type;
  _dispatch({ id, type });
}

/** Exit move mode unconditionally. */
export function deactivate(): void {
  if (!_movingId) return;
  _movingId   = null;
  _movingType = null;
  _dispatch(null);
}

export function getMoving() {
  return { movingId: _movingId, movingType: _movingType };
}

/** Called by mvInit to record where the last pointer event landed. */
export function setLastPointerPos(x: number, y: number): void {
  _lastPos = { x, y };
}

export function getLastPointerPos() {
  return _lastPos;
}
