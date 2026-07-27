// ── mvInit — document-level pointer tracking for move/paste ──────────────
// Call once at startup (main.tsx). Captures the position of every
// contextmenu and pointerdown event so actions.ts can read the coordinates
// when the "Paste Here" option is selected — without coupling ContextMenu
// internals to the move store.

import { setLastPointerPos } from './mvStore';

export function initMv(): void {
  // contextmenu fires on right-click — the primary way to open the paste menu
  document.addEventListener(
    'contextmenu',
    (e) => setLastPointerPos(e.clientX, e.clientY),
    true, // capture: fires before ContextMenu's own handler
  );

  // pointerdown covers touch long-press (ContextMenu's fallback trigger)
  document.addEventListener(
    'pointerdown',
    (e) => setLastPointerPos(e.clientX, e.clientY),
    true,
  );
}
