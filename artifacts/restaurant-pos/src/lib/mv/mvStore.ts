// ── Move store — separate state for item moves and section moves ───────────
// Item move and section move are fully independent: both can be active
// at the same time. Each dispatches its own event so consumers can
// subscribe only to the type they care about.

// ── State ─────────────────────────────────────────────────────────────────

let _movingItemId: string | null = null;
let _movingSectId: string | null = null;

// Last pointer position — updated by mvInit on contextmenu/pointerdown
// so actions.ts can read it when a paste option is clicked.
let _lastPos = { x: 0, y: 0 };

// ── Internal dispatchers ───────────────────────────────────────────────────

function _dispatchItem(id: string | null) {
  document.dispatchEvent(
    new CustomEvent<{ id: string } | null>('mv:item:change', { detail: id ? { id } : null }),
  );
}

function _dispatchSect(id: string | null) {
  document.dispatchEvent(
    new CustomEvent<{ id: string } | null>('mv:sect:change', { detail: id ? { id } : null }),
  );
}

// ── Item move ──────────────────────────────────────────────────────────────

/** Enter item-move mode. Same id → toggle off. */
export function activateItem(id: string): void {
  if (_movingItemId === id) { deactivateItem(); return; }
  _movingItemId = id;
  _dispatchItem(id);
}

/** Exit item-move mode unconditionally. */
export function deactivateItem(): void {
  if (!_movingItemId) return;
  _movingItemId = null;
  _dispatchItem(null);
}

export function getMovingItem() {
  return { movingId: _movingItemId };
}

// ── Section move ───────────────────────────────────────────────────────────

/** Enter section-move mode. Same id → toggle off. */
export function activateSect(id: string): void {
  if (_movingSectId === id) { deactivateSect(); return; }
  _movingSectId = id;
  _dispatchSect(id);
}

/** Exit section-move mode unconditionally. */
export function deactivateSect(): void {
  if (!_movingSectId) return;
  _movingSectId = null;
  _dispatchSect(null);
}

export function getMovingSect() {
  return { movingId: _movingSectId };
}

// ── Unified helpers ────────────────────────────────────────────────────────

/** Returns whichever move is currently active (item or section), or null. */
export function getMoving(): { movingId: string | null; movingType: 'item' | 'section' | null } {
  if (_movingItemId) return { movingId: _movingItemId, movingType: 'item' };
  if (_movingSectId) return { movingId: _movingSectId, movingType: 'section' };
  return { movingId: null, movingType: null };
}

/** Deactivates whichever move is currently active. */
export function deactivate(): void {
  if (_movingItemId) { deactivateItem(); return; }
  if (_movingSectId) { deactivateSect(); }
}

// ── Pointer position ───────────────────────────────────────────────────────

export function setLastPointerPos(x: number, y: number): void {
  _lastPos = { x, y };
}

export function getLastPointerPos() {
  return _lastPos;
}
