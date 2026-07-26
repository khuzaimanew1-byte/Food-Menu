// ── Document-level edit listeners ────────────────────────────────────────
// Call initEdt() once at app startup (main.tsx).

import { getActive, requestDeactivate, setDirty } from './edtStore';

export function initEdt() {
  // Track whether any content has changed inside the active element.
  document.addEventListener('input', () => {
    if (getActive().activeId) setDirty(true);
  });

  // Outside-click → attempt deactivate (Option B: modal only when dirty).
  // Capture phase so it fires even when inner handlers call stopPropagation.
  document.addEventListener(
    'click',
    (e) => {
      const { activeId, activeType } = getActive();
      if (!activeId) return;

      const target = e.target as Element | null;
      if (!target) return;

      // EdtBtn click → let that button's handler manage switching.
      if (target.closest('[data-edt-id]')) return;

      // Click inside the active element → keep edit mode.
      const activeEl = document.querySelector(
        `[data-area="${activeType}"][data-id="${CSS.escape(activeId)}"]`
      );
      if (activeEl?.contains(target)) return;

      requestDeactivate();
    },
    true // capture
  );
}
