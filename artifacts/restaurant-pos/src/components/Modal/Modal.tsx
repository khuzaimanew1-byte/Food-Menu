import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ClsIco } from '../icons/ClsIco';
import '../Button/base.css';
import './Modal.css';

export type ModalSize = 'sm' | 'md' | 'lg';

export interface ModalPr {
  open:     boolean;
  onClose:  () => void;
  title?:   string;
  children: React.ReactNode;
  size?:    ModalSize;
}

const FOCUSABLE_SEL = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

export function Modal({ open, onClose, title, children, size = 'md' }: ModalPr) {
  const [mounted, setMounted] = useState(false);
  const [exiting, setExiting] = useState(false);

  const dialogRef    = useRef<HTMLDivElement>(null);
  const prevFocusRef = useRef<HTMLElement | null>(null);
  const mountedRef   = useRef(false);

  useEffect(() => {
    if (open) {
      setExiting(false);
      setMounted(true);
      mountedRef.current = true;
      return;
    }
    if (!mountedRef.current) return;
    setExiting(true);
    const t = setTimeout(() => {
      setMounted(false);
      setExiting(false);
      mountedRef.current = false;
    }, 200);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!mounted) return;
    document.body.classList.add('mdl-open');
    return () => document.body.classList.remove('mdl-open');
  }, [mounted]);

  useEffect(() => {
    if (open) {
      prevFocusRef.current = document.activeElement as HTMLElement;
    } else {
      prevFocusRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!mounted || exiting) return;
    const first = dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE_SEL);
    const t = setTimeout(() => first?.focus(), 30);
    return () => clearTimeout(t);
  }, [mounted, exiting]);

  useEffect(() => {
    if (!mounted || exiting) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [mounted, exiting, onClose]);

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

  if (!mounted) return null;

  return createPortal(
    <div
      className={`mdl-root${exiting ? ' mdl-root--out' : ''}`}
      onKeyDown={handleKeyDown}
    >
      <div className="mdl-ovl" onClick={onClose} aria-hidden="true" />
      <div
        ref={dialogRef}
        className={`mdl-dlg mdl-dlg--${size}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {title !== undefined && (
          <div className="mdl-hdr">
            <h2 className="mdl-ttl ff-s">{title}</h2>
            <button className="btn mdl-cls" aria-label="Close" onClick={onClose}>
              <ClsIco />
            </button>
          </div>
        )}
        <div className="mdl-bdy">
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}
