// ── BsMdl — Infinity-inspired base modal ──────────────────────────────────
// Portal-rendered, centered, X-only dismiss. All other modals build on this.

import { useState, useEffect, useCallback } from 'react';
import { createPortal }                      from 'react-dom';
import { ClsIco }                            from '../icons/ClsIco';
import '../Button/base.css';
import './BsMdl.css';

export interface BsMdlPr {
  open:     boolean;
  onClose:  () => void;
  title:    string;
  children: React.ReactNode;
}

export function BsMdl({ open, onClose, title, children }: BsMdlPr) {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (open) {
      setExiting(false);
      setVisible(true);
    } else if (visible) {
      setExiting(true);
      const t = setTimeout(() => { setVisible(false); setExiting(false); }, 150);
      return () => clearTimeout(t);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleEsc = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') { e.preventDefault(); onClose(); }
  }, [onClose]);

  useEffect(() => {
    if (!visible) return;
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [visible, handleEsc]);

  if (!visible) return null;

  const rootCls = `bs-root${exiting ? ' bs-root--out' : ''}`;

  return createPortal(
    <div className={rootCls} role="dialog" aria-modal aria-label={title}>
      <div className="bs-ovl" onClick={onClose} aria-hidden />
      <div className="bs-dlg">
        <div className="bs-crown" aria-hidden />
        <div className="bs-hdr">
          <span className="bs-ttl ff-c">{title}</span>
          <button className="btn bs-cls" aria-label="Close" onClick={onClose}>
            <ClsIco />
          </button>
        </div>
        <div className="bs-bdy">
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}
