import { useRef, useEffect, useCallback } from 'react';
import './QuantityInput.css';

interface QtyInpPr {
  value: number;
  onChange?: (val: number) => void;
}

export function QuantityInput({ value, onChange }: QtyInpPr) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const editable = !!onChange;

  // Keep DOM in sync when value changes externally (± buttons)
  useEffect(() => {
    const el = spanRef.current;
    if (!el) return;
    // Only overwrite if the displayed text differs, to avoid caret jump while typing
    if (el.textContent !== String(value)) {
      el.textContent = String(value);
    }
  }, [value]);

  const handleInput = useCallback(() => {
    const el = spanRef.current;
    if (!el || !onChange) return;
    const raw      = el.textContent ?? '';
    const filtered = raw.replace(/\D/g, '') || '0';
    if (raw !== filtered) {
      el.textContent = filtered;
      // Restore caret to end
      const sel   = window.getSelection();
      const range = document.createRange();
      if (el.firstChild) {
        range.setStart(el.firstChild, filtered.length);
        range.collapse(true);
      } else {
        range.selectNodeContents(el);
        range.collapse(false);
      }
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
    const num = parseInt(filtered, 10);
    onChange(isNaN(num) ? 0 : num);
  }, [onChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      (e.currentTarget as HTMLElement).blur();
    }
  }, []);

  // On focus: select all so user can type-replace immediately
  const handleFocus = useCallback(() => {
    const el = spanRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      const sel   = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(el);
      sel?.removeAllRanges();
      sel?.addRange(range);
    });
  }, []);

  return (
    <span
      ref={spanRef}
      className={`qty-inp${editable ? ' qty-inp-edt' : ''}`}
      aria-live={editable ? undefined : 'polite'}
      aria-label={`Quantity: ${value}`}
      contentEditable={editable || undefined}
      suppressContentEditableWarning
      onInput={editable ? handleInput : undefined}
      onKeyDown={editable ? handleKeyDown : undefined}
      onFocus={editable ? handleFocus : undefined}
    >
      {value}
    </span>
  );
}
