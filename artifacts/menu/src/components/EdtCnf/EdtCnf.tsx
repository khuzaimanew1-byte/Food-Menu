// ── EdtCnf — edit confirmation modal ─────────────────────────────────────
// Extracted from App.tsx. Owns its own event subscriptions and layout
// calculation. App.tsx mounts this as a child of pg-wrap; it positions
// itself absolutely to the right of the active item.

import { useState, useEffect } from 'react';
import { SmMdl } from '../SmMdl/SmMdl';
import { saveAndDeactivate, deactivate, getActive, isDirty } from '@/lib/edt/edtStore';

function computeLayout(activeId: string | null) {
  const pgWrap = document.querySelector('.pg-wrap');
  const itemEl = activeId
    ? document.querySelector<HTMLElement>(`[data-area="item"][data-id="${CSS.escape(activeId)}"]`)
    : null;
  const pw  = pgWrap?.getBoundingClientRect();
  const it  = itemEl?.getBoundingClientRect();
  const top = pw && it ? it.top - pw.top + it.height / 2 : undefined;
  // Approx modal right edge: pgWrap.right + 14px gap + ~160px modal + 12px margin
  const overflow = pw ? Math.max(0, pw.right + 14 + 160 + 12 - window.innerWidth) : 0;
  return { top, offsetX: overflow };
}

export function EdtCnf() {
  const [open,      setOpen]      = useState(false);
  const [anchorTop, setAnchorTop] = useState<number | undefined>();
  const [offsetX,   setOffsetX]   = useState(0);

  // Outside-click path → show modal
  useEffect(() => {
    const show = () => {
      const { activeId } = getActive();
      const layout = computeLayout(activeId);
      setAnchorTop(layout.top);
      setOffsetX(layout.offsetX);
      setOpen(true);
    };
    document.addEventListener('edt:confirm-needed', show);
    return () => document.removeEventListener('edt:confirm-needed', show);
  }, []);

  // Recompute on resize while modal is open
  useEffect(() => {
    if (!open) return;
    const onResize = () => {
      const { activeId } = getActive();
      const layout = computeLayout(activeId);
      setAnchorTop(layout.top);
      setOffsetX(layout.offsetX);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [open]);

  // Enter key while editing (modal NOT open) → direct save, no modal
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key !== 'Enter') return;
      if (open) return;
      const { activeId } = getActive();
      if (!activeId || !isDirty()) return;
      e.preventDefault();
      saveAndDeactivate();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  return (
    <SmMdl
      open={open}
      title="Save changes?"
      confirmLabel="Save"
      anchorTop={anchorTop}
      offsetX={offsetX}
      onConfirm={() => { setOpen(false); saveAndDeactivate(); }}
      onClose={() => { setOpen(false); deactivate(); }}
    />
  );
}
