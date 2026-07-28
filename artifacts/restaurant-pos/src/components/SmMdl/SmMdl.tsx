import { useState, useEffect, useCallback } from 'react';
import { ClsIco } from '../icons/ClsIco';
import '../Button/base.css';
import './SmMdl.css';

export interface SmMdlPr {
  open:          boolean;
  title:         string;
  confirmLabel?: string;
  onConfirm:     () => void;
  onClose:       () => void;
  anchorTop?:    number;
  offsetX?:      number;
}

export function SmMdl({
  open,
  title,
  confirmLabel = 'Confirm',
  onConfirm,
  onClose,
  anchorTop,
  offsetX = 0,
}: SmMdlPr) {
  const [show,     setShow]     = useState(open);
  const [cfmFlash, setCfmFlash] = useState(false);

  useEffect(() => {
    if (open) { setShow(true); return; }
    const t = setTimeout(() => setShow(false), 70);
    return () => clearTimeout(t);
  }, [open]);

  const triggerConfirm = useCallback(() => {
    setCfmFlash(true);
    setTimeout(() => { setCfmFlash(false); onConfirm(); }, 90);
  }, [onConfirm]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter') { e.preventDefault(); triggerConfirm(); }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, triggerConfirm]);

  if (!show) return null;

  const isExiting = !open;
  const style: React.CSSProperties = {};
  if (anchorTop !== undefined) style.top = anchorTop;
  if (offsetX > 0) style.translate = `-${offsetX}px 0`;

  return (
    <div
      className={`sm-mdl${isExiting ? ' sm-mdl--out' : ''}`}
      style={style}
      role="dialog"
      aria-modal
      aria-label={title}
    >
      <div className="sm-hdr">
        <p className="sm-ttl ff-s">{title}</p>
        <button className="btn sm-cls" aria-label="Close" onClick={onClose}>
          <ClsIco />
        </button>
      </div>
      <div className="sm-acts">
        <button
          className={`btn glass sm-cfm ff-s${cfmFlash ? ' sm-cfm--flash' : ''}`}
          onClick={triggerConfirm}
          aria-label={confirmLabel}
        >
          {confirmLabel}
        </button>
        <span className="sm-hint ff-s" aria-hidden>↩ Enter</span>
      </div>
    </div>
  );
}
