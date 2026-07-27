// ── Modal — reusable full-screen overlay shell ─────────────────────────────
// Controlled by parent via `open` prop.
// Supports: scroll, Escape close, body-scroll-lock, focus-trap, portal.

import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ClsIco } from '../icons/ClsIco';
import '../Button/base.css';
import './Modal.css';

// ── Types ───────────────────────────────────────────────────────────────────

export type ModalSize = 'sm' | 'md' | 'lg';

export interface ModalPr {
  open:     boolean;
  onClose:  () => void;
  title?:   string;
  children: React.ReactNode;
  size?:    ModalSize;
}

// ── Focusable selector (for focus-trap) ─────────────────────────────────────

const FOCUSABLE_SEL = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

// ── Component ───────────────────────────────────────────────────────────────

export function Modal({ open, onClose, title, children, size = 'md' }: ModalPr) {
  // `mounted`  — whether the portal DOM node exists
  // `exiting`  — plays the --out animation before unmounting
  const [mounted, setMounted] = useState(false);
  const [exiting, setExiting] = useState(false);

  const dialogRef    = useRef<HTMLDivElement>(null);
  const prevFocusRef = useRef<HTMLElement | null>(null);

  // ── Mount / unmount with exit-animation delay ──────────────────────────

  useEffect(() => {
    if (open) {
      setExiting(false);
      setMounted(true);
      return;
    }
    if (mounted) {
      setExiting(true);
      const t = setTimeout(() => {
        setMounted(false);
        setExiting(false);
      }, 200);
      return () => clearTimeout(t);
    }
    return;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // ── Body scroll-lock + page-blur (via body class) ──────────────────────

  useEffect(() => {
    if (!mounted) return;
    document.body.classList.add('mdl-open');
    return () => document.body.classList.remove('mdl-open');
  }, [mounted]);

  // ── Save + restore focus across open/close ─────────────────────────────

  useEffect(() => {
    if (open) {
      prevFocusRef.current = document.activeElement as HTMLElement;
    } else {
      prevFocusRef.current?.focus();
    }
  }, [open]);

  // ── Auto-focus first focusable element on open ─────────────────────────

  useEffect(() => {
    if (!mounted || exiting) return;
    const first = dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE_SEL);
    // Slight defer so the animation frame doesn't fight the focus
    const t = setTimeout(() => first?.focus(), 30);
    return () => clearTimeout(t);
  }, [mounted, exiting]);

  // ── Escape-key close (document-level) ──────────────────────────────────

  useEffect(() => {
    if (!mounted || exiting) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [mounted, exiting, onClose]);

  // ── Focus trap (Tab / Shift+Tab stays inside modal) ────────────────────

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Tab') return;

    const focusable = Array.from(
      dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SEL) ?? [],
    ).filter(el => getComputedStyle(el).visibility !== 'hidden');

    if (!focusable.length) { e.preventDefault(); return; }

    const first = focusable[0];
    const last  = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
    }
  }, []);

  // ── Render ─────────────────────────────────────────────────────────────

  if (!mounted) return null;

  return createPortal(
    <div
      className={`mdl-root${exiting ? ' mdl-root--out' : ''}`}
      onKeyDown={handleKeyDown}
      // Not aria-hidden — the modal itself is the live region
    >
      {/* Dark overlay — click to close */}
      <div className="mdl-ovl" onClick={onClose} aria-hidden="true" />

      {/* Dialog shell */}
      <div
        ref={dialogRef}
        className={`mdl-dlg mdl-dlg--${size}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {/* Header — only rendered when title is provided */}
        {title !== undefined && (
          <div className="mdl-hdr">
            <h2 className="mdl-ttl ff-s">{title}</h2>
            <button
              className="btn mdl-cls"
              aria-label="Close"
              onClick={onClose}
            >
              <ClsIco />
            </button>
          </div>
        )}

        {/* Scrollable content area */}
        <div className="mdl-bdy">
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}
