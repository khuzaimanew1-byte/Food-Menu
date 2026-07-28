// ── EdtCnf — edit confirmation modal ─────────────────────────────────────
// Per-component aware: confirm/discard only affect the ids that triggered
// the modal (pending ids), not all active elements.
// Other active components remain untouched after confirm or discard.

import { useState, useEffect } from 'react';
import { SmMdl } from '../SmMdl/SmMdl';
import {
  confirmSave,
  confirmDiscard,
  saveAndDeactivate,
  getActive,
  isDirty,
  hasAnyActive,
} from '@/lib/edt/edtStore';

function computeLayout(activeId: string | null) {
  const pgWrap = document.querySelector('.pg-wrap');
  const itemEl = activeId
    ? document.querySelector<HTMLElement>(`[data-area="item"][data-id="${CSS.escape(activeId)}"]`)
    : null;
  const pw  = pgWrap?.getBoundingClientRect();
  const it  = itemEl?.getBoundingClientRect();
  const top = pw && it ? it.top - pw.top + it.height / 2 : undefined;
  const overflow = pw ? Math.max(0, pw.right + 14 + 160 + 12 - window.innerWidth) : 0;
  return { top, offsetX: overflow };
}

export function EdtCnf() {
  const [open,      setOpen]      = useState(false);
  const [anchorTop, setAnchorTop] = useState<number | undefined>();
  const [offsetX,   setOffsetX]   = useState(0);

  // Outside-click path → show modal (triggered by requestDeactivate when dirty)
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

  // Enter key while editing (modal NOT open) → save all dirty active elements
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key !== 'Enter') return;
      if (open) return;
      if (!hasAnyActive() || !isDirty()) return;
      e.preventDefault();
      saveAndDeactivate(); // saves all active elements
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
      onConfirm={() => { setOpen(false); confirmSave(); }}    // saves pending ids only
      onClose={() => { setOpen(false); confirmDiscard(); }}  // discards pending ids only
    />
  );
}
