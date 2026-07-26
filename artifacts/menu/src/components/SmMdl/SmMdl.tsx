import { useState, useEffect } from 'react';
import { ClsIco } from '../icons/ClsIco';
import '../Button/base.css';
import '../Button/ico-on.css';
import './SmMdl.css';

export interface SmMdlPr {
  open:          boolean;
  title:         string;
  confirmLabel?: string;
  /** Optional small avatar img src for context */
  avatarSrc?:    string;
  /** Fallback initials text if no img */
  avatarName?:   string;
  onConfirm:     () => void;
  /** Called on × button — typically discard / cancel */
  onClose:       () => void;
}

/**
 * SmMdl — lightweight anchored confirmation panel.
 * Anchored right side, vertical layout. Enter → confirm flash → action.
 * Keyboard logic lives here: reused wherever SmMdl is mounted.
 */
export function SmMdl({
  open,
  title,
  confirmLabel = 'Confirm',
  avatarSrc,
  avatarName,
  onConfirm,
  onClose,
}: SmMdlPr) {
  const [show,     setShow]     = useState(open);
  const [cfmFlash, setCfmFlash] = useState(false);

  useEffect(() => {
    if (open) {
      setShow(true);
      return;
    }
    const t = setTimeout(() => setShow(false), 70);
    return () => clearTimeout(t);
  }, [open]);

  // Keyboard: Enter → confirm; only while open; cleanup on close
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

  const hasAvt   = avatarSrc !== undefined || avatarName !== undefined;
  const initials = avatarName ? avatarName.slice(0, 2).toUpperCase() : '';

  return (
    <div
      className={`sm-mdl${!open ? ' sm-mdl--out' : ''}`}
      role="dialog"
      aria-modal
      aria-label={title}
    >
      {/* ── Header: avatar + title + close ── */}
      <div className="sm-hdr">
        {hasAvt && (
          <div className="sm-avt" aria-hidden>
            {avatarSrc
              ? <img src={avatarSrc} alt="" />
              : <span className="sm-avt-init ff-s">{initials}</span>}
          </div>
        )}
        <p className="sm-ttl ff-s">{title}</p>
        <button className="btn btio sm-cls" aria-label="Close" onClick={onClose}>
          <ClsIco />
        </button>
      </div>

      {/* ── Divider ── */}
      <div className="sm-div" aria-hidden />

      {/* ── Confirm + hint ── */}
      <div className="sm-acts">
        <button
          className={`btn sm-cfm ff-s${cfmFlash ? ' sm-cfm--flash' : ''}`}
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
