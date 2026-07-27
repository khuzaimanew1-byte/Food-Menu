// ── moveSection — enter move mode for this section ────────────────────────
// Activates move mode so the next right-click on a different section
// shows "Paste Here". Clicking the same section again cancels.
// Paste logic lives in actions/index.ts (dispatchCtxAction).

import { activateSect, deactivateSect, getMovingSect } from '@/lib/mv/mvStore';

export function moveSection(id: string | null): void {
  if (!id) return;
  const { movingId } = getMovingSect();
  if (movingId === id) { deactivateSect(); return; }
  activateSect(id);
}
