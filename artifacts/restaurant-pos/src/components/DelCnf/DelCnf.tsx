// ── DelCnf — delete confirmation ─────────────────────────────────────────
// Listens for 'del:cnf' event → opens CnfMdl (danger) → execDel on confirm.
// Architecture: BsMdl → CnfMdl → DelCnf

import { useState, useEffect, useCallback } from 'react';
import { CnfMdl }                            from '../CnfMdl/CnfMdl';
import { execDel, type DelType }             from '@/lib/del/delExec';

interface Pending { id: string; type: DelType; name: string }

export function DelCnf() {
  const [open,    setOpen]    = useState(false);
  const [pending, setPending] = useState<Pending | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const { id, type, name } = (e as CustomEvent<Pending>).detail ?? {};
      if (!id || !type) return;
      setPending({ id, type, name: name ?? '' });
      setOpen(true);
    };
    document.addEventListener('del:cnf', handler);
    return () => document.removeEventListener('del:cnf', handler);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setTimeout(() => setPending(null), 200);
  }, []);

  const confirm = useCallback(() => {
    if (pending) execDel(pending.id, pending.type);
  }, [pending]);

  const kind = pending?.type === 'section' ? 'Section'
             : pending?.type === 'role'    ? 'Role'
             : pending?.type === 'unit'    ? 'Unit'
             : 'Item';
  const title   = `Delete ${kind}`;
  const message = pending?.name
    ? `"${pending.name}" will be permanently deleted.`
    : `This ${kind.toLowerCase()} will be permanently deleted.`;

  return (
    <CnfMdl
      open={open}
      onClose={close}
      title={title}
      message={message}
      confirmLabel="Delete"
      danger
      onConfirm={confirm}
    />
  );
}
