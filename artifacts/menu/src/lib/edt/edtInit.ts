// ── Document-level edit listeners ────────────────────────────────────────
// Call initEdt() once at app startup (main.tsx).

import { getActive, deactivate } from './edtStore';

export function initEdt() {
  // Outside-click → deactivate (Option B: only when no changes made,
  // but for text-only contentEditable changes are kept on deactivate).
  // Capture phase so it runs even when inner handlers call stopPropagation.
  document.addEventListener(
    'click',
    (e) => {
      const { activeId, activeType } = getActive();
      if (!activeId) return;

      const target = e.target as Element | null;
      if (!target) return;

      // If the click is on any EdtBtn → let that button's handler manage it.
      if (target.closest('[data-edt-id]')) return;

      // If the click is inside the active element → ignore.
      const activeEl = document.querySelector(
        `[data-area="${activeType}"][data-id="${CSS.escape(activeId)}"]`
      );
      if (activeEl?.contains(target)) return;

      deactivate();
    },
    true // capture
  );
}
