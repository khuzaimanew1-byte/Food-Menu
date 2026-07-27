// ── moveItem — enter move mode for this item ──────────────────────────────
// Activates move mode so the next right-click on a different item
// shows "Paste Here". Clicking the same item again cancels.
// Paste logic lives in actions/index.ts (dispatchCtxAction).

import { activate, deactivate, getMoving } from '@/lib/mv/mvStore';

export function moveItem(id: string | null): void {
  if (!id) return;
  const { movingId } = getMoving();
  if (movingId === id) { deactivate(); return; }   // toggle off
  activate(id, 'item');
}
