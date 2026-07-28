// ── Document-level edit listeners ────────────────────────────────────────
// Call initEdt() inside MnPg (not main.tsx) — it is page-specific logic.
// destroyEdt() removes the same listeners; call it on unmount.

import { getActive, requestDeactivate, setDirty } from './edtStore';

// Stable handler refs so removeEventListener can match them exactly.
const _onInput = () => {
  if (getActive().activeId) setDirty(true);
};

const _onClick = (e: MouseEvent) => {
  const { activeId, activeType } = getActive();
  if (!activeId) return;

  const target = e.target as Element | null;
  if (!target) return;

  // EdtBtn click → let that button's handler manage switching.
  if (target.closest('[data-edt-id]')) return;

  // Programmatic file-input click from upldStore.pick() — ignore.
  if (target.closest('[data-edt-ignore]')) return;

  // Click inside the active element → keep edit mode.
  const activeEl = document.querySelector(
    `[data-area="${activeType}"][data-id="${CSS.escape(activeId)}"]`
  );
  if (activeEl?.contains(target)) return;

  requestDeactivate();
};

export function initEdt(): void {
  document.addEventListener('input', _onInput);
  document.addEventListener('click', _onClick, true); // capture
}

export function destroyEdt(): void {
  document.removeEventListener('input', _onInput);
  document.removeEventListener('click', _onClick, true);
}
