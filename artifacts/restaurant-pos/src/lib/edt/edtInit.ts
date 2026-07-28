// ── Document-level edit listeners ────────────────────────────────────────
// Call initEdt() inside MnPg (not main.tsx) — it is page-specific logic.
// destroyEdt() removes the same listeners; call it on unmount.
//
// Outside-click deactivation is per-component: each active element
// independently detects whether the click was outside itself, and
// only that element deactivates. Other active components are unaffected.

import { getActive, requestDeactivate, setDirty } from './edtStore';

// Stable handler refs so removeEventListener can match them exactly.
const _onInput = () => {
  if (getActive().all.length) setDirty(true);
};

const _onClick = (e: MouseEvent) => {
  const { all } = getActive();
  if (!all.length) return;

  const target = e.target as Element | null;
  if (!target) return;

  // EdtBtn click → let that button's handler manage switching.
  if (target.closest('[data-edt-id]')) return;

  // Programmatic file-input click from upldStore.pick() — ignore.
  if (target.closest('[data-edt-ignore]')) return;

  // Per-component outside-click: collect IDs where the click landed outside.
  const outsideIds: string[] = [];
  for (const { id, type } of all) {
    const el = document.querySelector(
      `[data-area="${type}"][data-id="${CSS.escape(id)}"]`,
    );
    if (!el?.contains(target)) {
      outsideIds.push(id);
    }
  }

  if (outsideIds.length > 0) {
    requestDeactivate(outsideIds);
  }
};

export function initEdt(): void {
  document.addEventListener('input', _onInput);
  document.addEventListener('click', _onClick, true); // capture
}

export function destroyEdt(): void {
  document.removeEventListener('input', _onInput);
  document.removeEventListener('click', _onClick, true);
}
