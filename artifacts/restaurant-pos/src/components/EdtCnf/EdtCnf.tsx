// ── EdtCnf — edit confirmation wiring ────────────────────────────────────
// Listens for edt:confirm-needed (dispatched by edtStore.requestDeactivate
// when dirty). Positions SmMdl via anchorPos using the anchorEl passed in
// the event detail — no item/section type knowledge here.
// Enter direct-save (no modal) lives in edtInit.ts.

import { useState, useEffect, useRef, useCallback } from 'react';
import { SmMdl }                from '../SmMdl/SmMdl';
import { saveAndDeactivate, deactivate, setCnfOpen } from '@/lib/edt/edtStore';
import { anchorRight }          from '@/lib/pos/anchorPos';

export function EdtCnf() {
  const [open,      setOpen]      = useState(false);
  const [anchorTop, setAnchorTop] = useState<number | undefined>();
  const [offsetX,   setOffsetX]   = useState(0);
  const anchorRef = useRef<HTMLElement | null>(null);

  // Keep edtStore cnfOpen flag in sync so edtInit Enter handler knows.
  useEffect(() => { setCnfOpen(open); }, [open]);

  const applyLayout = useCallback((anchorEl: HTMLElement | null) => {
    const containerEl = document.querySelector<HTMLElement>('.pg-wrap');
    const { top, offsetX: ox } = anchorRight(anchorEl, containerEl);
    setAnchorTop(top);
    setOffsetX(ox);
  }, []);

  // edt:confirm-needed → anchorEl from event detail → position + open
  useEffect(() => {
    const show = (e: Event) => {
      const { anchorEl = null } =
        (e as CustomEvent<{ anchorEl: HTMLElement | null }>).detail ?? {};
      anchorRef.current = anchorEl;
      applyLayout(anchorEl);
      setOpen(true);
    };
    document.addEventListener('edt:confirm-needed', show);
    return () => document.removeEventListener('edt:confirm-needed', show);
  }, [applyLayout]);

  // Recompute on resize while open.
  useEffect(() => {
    if (!open) return;
    const onResize = () => applyLayout(anchorRef.current);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [open, applyLayout]);

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
