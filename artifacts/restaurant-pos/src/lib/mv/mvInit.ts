// ── mvInit — document-level pointer tracking for move/paste ──────────────
// Call initMv() inside MnPg (not main.tsx) — it is page-specific logic.
// destroyMv() removes the same listeners; call it on unmount.

import { setLastPointerPos } from './mvStore';

// Stable handler refs so removeEventListener can match them exactly.
const _onCtx = (e: MouseEvent)  => setLastPointerPos(e.clientX, e.clientY);
const _onPtr = (e: PointerEvent) => setLastPointerPos(e.clientX, e.clientY);

export function initMv(): void {
  // contextmenu fires on right-click — the primary way to open the paste menu
  document.addEventListener('contextmenu', _onCtx, true); // capture: before ContextMenu
  // pointerdown covers touch long-press (ContextMenu's fallback trigger)
  document.addEventListener('pointerdown', _onPtr, true);
}

export function destroyMv(): void {
  document.removeEventListener('contextmenu', _onCtx, true);
  document.removeEventListener('pointerdown', _onPtr, true);
}
