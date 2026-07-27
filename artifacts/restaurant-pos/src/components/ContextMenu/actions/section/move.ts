// ── moveSection — enter move mode for this section ────────────────────────
// Activates move mode so the next right-click on a different section
// shows "Paste Here". Clicking the same section again cancels.
// Paste logic lives in actions/index.ts (dispatchCtxAction).

import { activate, deactivate, getMoving } from '@/lib/mv/mvStore';

export function moveSection(id: string | null): void {
  if (!id) return;
  const { movingId } = getMoving();
  if (movingId === id) { deactivate(); return; }   // toggle off
  activate(id, 'section');
}
