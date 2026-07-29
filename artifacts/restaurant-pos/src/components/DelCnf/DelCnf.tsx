// ── DelCnf — delete confirmation modal ───────────────────────────────────
// Listens for 'del:cnf' event dispatched by deleteItem / deleteSection.
// Shows a centered SmMdl with a gl-tinted backdrop.
// Actual delete runs only on confirm → execDel (trash + api + store).

import { useState, useEffect, useCallback } from 'react';
import { SmMdl }                             from '../SmMdl/SmMdl';
import { execDel, type DelType }             from '@/lib/del/delExec';
import './DelCnf.css';

interface Pending { id: string; type: DelType; name: string }

export function DelCnf() {
  const [open,    setOpen]    = useState(false);
  const [pending, setPending] = useState<Pending | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const { id, type } = (e as CustomEvent<Pending>).detail ?? {};
      if (!id || !type) return;
      setPending({ id, type });
      setOpen(true);
    };
    document.addEventListener('del:cnf', handler);
    return () => document.removeEventListener('del:cnf', handler);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setTimeout(() => setPending(null), 80);
  }, []);

  const confirm = useCallback(() => {
    if (pending) execDel(pending.id, pending.type);
    setOpen(false);
    setTimeout(() => setPending(null), 80);
  }, [pending]);

  if (!pending && !open) return null;

  const kind  = pending?.type === 'section' ? 'Section' : 'Item';
  const label = pending ? `Delete ${kind}: "${pending.name}"?` : `Delete ${kind}?`;

  return (
    <>
      {open && <div className="del-bg" onClick={close} aria-hidden />}
      <SmMdl
        centered
        open={open}
        title={label}
        confirmLabel="Delete"
        onConfirm={confirm}
        onClose={close}
      />
    </>
  );
}
