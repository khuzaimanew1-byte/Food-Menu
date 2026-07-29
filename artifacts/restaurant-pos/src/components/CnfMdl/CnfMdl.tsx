// ── CnfMdl — confirm modal built on BsMdl ────────────────────────────────
// Adds: message text, confirm button (danger variant), Enter-key shortcut.
// X button (from BsMdl) = cancel — no separate cancel button.

import { useEffect } from 'react';
import { BsMdl }     from '../BsMdl/BsMdl';
import './CnfMdl.css';

export interface CnfMdlPr {
  open:          boolean;
  onClose:       () => void;
  title:         string;
  message?:      string;
  confirmLabel?: string;
  danger?:       boolean;
  onConfirm:     () => void;
}

export function CnfMdl({
  open, onClose, title, message,
  confirmLabel = 'Confirm', danger = false, onConfirm,
}: CnfMdlPr) {

  // Enter key → confirm (while modal is open)
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Enter') { e.preventDefault(); onConfirm(); onClose(); }
    };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [open, onConfirm, onClose]);

  return (
    <BsMdl open={open} onClose={onClose} title={title}>
      {message && <p className="cm-msg ff-s">{message}</p>}
      <div className="cm-acts">
        <button
          className={`btn cm-cfm ff-s${danger ? ' cm-cfm--dng' : ''}`}
          onClick={() => { onConfirm(); onClose(); }}
        >
          {confirmLabel}
        </button>
        <span className="cm-hint ff-s" aria-hidden>↩ Enter</span>
      </div>
    </BsMdl>
  );
}
