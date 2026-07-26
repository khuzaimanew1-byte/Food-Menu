import { useState, useEffect } from 'react';
import { ClsIco } from '../icons/ClsIco';
import '../Button/base.css';
import './SmMdl.css';

export interface SmMdlPr {
  open:          boolean;
  title:         string;
  confirmLabel?: string;
  onConfirm:     () => void;
  /** Called on × button — discard / cancel */
  onClose:       () => void;
  /** Top offset (px) relative to pg-wrap — centres modal on the active item */
  anchorTop?:    number;
}

/**
 * SmMdl — square anchored confirmation panel.
 * Absolutely positioned to the right of pg-wrap.
 * Enter → confirm flash → action (when open).
 */
export function SmMdl({
  open,
  title,
  confirmLabel = 'Confirm',
  onConfirm,
  onClose,
  anchorTop,
}: SmMdlPr) {
  const [show,     setShow]     = useState(open);
  const [cfmFlash, setCfmFlash] = useState(false);

  useEffect(() => {
    if (open) { setShow(true); return; }
    const t = setTimeout(() => setShow(false), 70);
    return () => clearTimeout(t);
  }, [open]);

  // Enter → confirm while modal is open
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter') { e.preventDefault(); triggerConfirm(); }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  function triggerConfirm() {
    setCfmFlash(true);
    setTimeout(() => { setCfmFlash(false); onConfirm(); }, 90);
  }

  if (!show) return null;

  const isExiting = !open;
  const topStyle  = anchorTop !== undefined ? anchorTop : undefined;

  return (
    <div
      className={`sm-mdl${isExiting ? ' sm-mdl--out' : ''}`}
      style={topStyle !== undefined ? { top: topStyle } : undefined}
      role="dialog"
      aria-modal
      aria-label={title}
    >
      {/* Title */}
      <p className="sm-ttl ff-s">{title}</p>

      {/* Confirm + keyboard hint — one row */}
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

      {/* Close */}
      <button
        className="btn sm-cls"
        aria-label="Close"
        onClick={onClose}
      >
        <ClsIco />
      </button>
    </div>
  );
}
