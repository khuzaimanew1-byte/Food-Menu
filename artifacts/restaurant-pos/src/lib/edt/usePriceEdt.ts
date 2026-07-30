import { useState, useEffect, useRef, useCallback } from 'react';
import { pkFmt } from '@/lib/fmt/fmt';
import { stripCurrency } from '@/lib/currency';
import { setDirty } from './edtStore';

const DEF_PRICE = '0';

function toRaw(price?: string): string {
  return (stripCurrency(price ?? DEF_PRICE).replace(/\D/g, '')) || '0';
}

/**
 * Reusable price-field edit logic for a contentEditable <span>.
 *
 * Encapsulates:
 * - raw ↔ formatted toggle when edit mode activates / deactivates
 * - digits-only real-time filtering with cursor preservation
 * - edt:save event price extraction and sanitization
 *
 * Usage:
 *   const { priceRef, displayPrice, handlePriceInput } =
 *     usePriceEdt(id, isActive, price);
 *
 *   <span
 *     ref={priceRef}
 *     data-edt-field={isActive ? "price" : undefined}
 *     contentEditable={isActive || undefined}
 *     suppressContentEditableWarning
 *     onInput={isActive ? handlePriceInput : undefined}
 *   >
 *     {displayPrice}
 *   </span>
 */
export function usePriceEdt(
  id: string | number,
  isActive: boolean,
  price?: string,
) {
  const [editedPrice, setEditedPrice] = useState<string | null>(null);
  const priceRef    = useRef<HTMLSpanElement>(null);
  const rawPriceRef = useRef(toRaw(price));

  // Keep rawPriceRef current every render (no extra effect needed)
  rawPriceRef.current = editedPrice ?? toRaw(price);

  // raw ↔ formatted toggle on mode switch
  useEffect(() => {
    if (!priceRef.current) return;
    priceRef.current.textContent = isActive
      ? rawPriceRef.current          // edit: plain digits
      : pkFmt(rawPriceRef.current);  // view: formatted
  }, [isActive]);

  // Persist price from edt:save
  useEffect(() => {
    const handler = (e: Event) => {
      const d = (e as CustomEvent<{ id: string; fields: Record<string, string> }>).detail;
      if (d?.id !== String(id)) return;
      if (d.fields['price'] !== undefined) {
        setEditedPrice(d.fields['price'].replace(/\D/g, '') || '0');
      }
    };
    document.addEventListener('edt:save', handler);
    return () => document.removeEventListener('edt:save', handler);
  }, [id]);

  // Real-time digits-only filter with cursor fix
  const handlePriceInput = useCallback(() => {
    const span = priceRef.current;
    if (!span) return;
    const raw      = span.textContent ?? '';
    const filtered = raw.replace(/\D/g, '');
    if (raw !== filtered) {
      span.textContent = filtered;
      const sel   = window.getSelection();
      const range = document.createRange();
      if (span.firstChild) {
        range.setStart(span.firstChild, filtered.length);
        range.collapse(true);
      } else {
        range.selectNodeContents(span);
        range.collapse(false);
      }
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
    setDirty(true);
  }, []);

  const displayPrice = pkFmt(editedPrice ?? toRaw(price));

  return { priceRef, displayPrice, handlePriceInput };
}
