// ── DelCnf — delete confirmation modal ───────────────────────────────────
// Listens for 'del:cnf' event dispatched by deleteItem / deleteSection.
// Shows a centered SmMdl with a gl-tinted backdrop.
// Actual delete runs only on confirm → execDel (trash + api + store).

import { useState, useEffect, useCallback } from 'react';
import { Modal }                             from '../Modal/Modal';
import { execDel, type DelType }             from '@/lib/del/delExec';
import './DelCnf.css';

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
    close();
  }, [pending, close]);

  const kind  = pending?.type === 'section' ? 'Section' : 'Item';
  const label = pending?.name
    ? `"${pending.name}" delete ho jayega`
    : `Yeh ${kind.toLowerCase()} delete ho jayega`;

  return (
    <Modal open={open} onClose={close} title={`${kind} Delete Karein?`} size="sm">
      <p className="del-msg ff-s">{label}</p>
      <div className="del-acts">
        <button className="btn del-cancel ff-s" onClick={close}>
          Cancel
        </button>
        <button className="btn del-cfm ff-s" onClick={confirm}>
          Delete
        </button>
      </div>
    </Modal>
  );
}
