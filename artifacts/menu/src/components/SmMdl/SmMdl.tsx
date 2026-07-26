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
  /** When provided, modal anchors to this fixed position (right of pg-wrap) */
  anchorPos?:    { top: number; left: number };
}

/**
 * SmMdl — lightweight anchored confirmation panel.
 * No full-screen overlay. Enter → confirm flash → action.
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
  anchorPos,
}: SmMdlPr) {
  // Internal visibility tracks open with a brief exit delay
  const [show,     setShow]     = useState(open);
  const [cfmFlash, setCfmFlash] = useState(false);

  useEffect(() => {
    if (open) {
      setShow(true);
      return;
    }
    // exit animation plays while show=true, open=false
    const t = setTimeout(() => setShow(false), 70);
    return () => clearTimeout(t);
  }, [open]);

  // Keyboard: Enter → confirm; only while open
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        triggerConfirm();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  function triggerConfirm() {
    setCfmFlash(true);
    setTimeout(() => {
      setCfmFlash(false);
      onConfirm();
    }, 90);
  }

  if (!show) return null;

  const hasAvt = avatarSrc !== undefined || avatarName !== undefined;
  const initials = avatarName ? avatarName.slice(0, 2).toUpperCase() : '';
  const isExiting = !open;
  const isAnchored = anchorPos !== undefined;

  const anchorStyle: React.CSSProperties | undefined = isAnchored
    ? { top: anchorPos!.top, left: anchorPos!.left }
    : undefined;

  return (
    <div
      className={`sm-mdl${isAnchored ? ' sm-mdl--anchored' : ''}${isExiting ? ' sm-mdl--out' : ''}`}
      style={anchorStyle}
      role="dialog"
      aria-modal
      aria-label={title}
    >
      {/* Avatar — small context thumbnail */}
      {hasAvt && (
        <div className="sm-avt" aria-hidden>
          {avatarSrc
            ? <img src={avatarSrc} alt="" />
            : <span className="sm-avt-init ff-s">{initials}</span>}
        </div>
      )}

      {/* Title */}
      <p className="sm-ttl ff-s">{title}</p>

      {/* Confirm button + keyboard hint */}
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

      {/* Close / discard */}
      <button
        className="btn btio sm-cls"
        aria-label="Close"
        onClick={onClose}
      >
        <ClsIco />
      </button>
    </div>
  );
}
