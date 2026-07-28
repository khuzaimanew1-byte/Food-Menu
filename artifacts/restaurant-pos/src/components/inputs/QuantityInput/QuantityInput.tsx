import { useState, useRef, useEffect } from 'react';
import './QuantityInput.css';

interface QtyInpPr {
  value: number;
  onChange?: (val: number) => void;
}

export function QuantityInput({ value, onChange }: QtyInpPr) {
  const editable = !!onChange;
  const [localVal, setLocalVal] = useState(String(value));
  const focusedRef = useRef(false);

  // Sync from parent (± buttons) only when not actively typing
  useEffect(() => {
    if (!focusedRef.current) setLocalVal(String(value));
  }, [value]);

  if (!editable) {
    return (
      <span className="qty-inp" aria-live="polite" aria-label={`Quantity: ${value}`}>
        {value}
      </span>
    );
  }

  return (
    <input
      type="text"
      inputMode="numeric"
      className="qty-inp qty-inp-edt"
      aria-label={`Quantity: ${value}`}
      value={localVal}
      onFocus={(e) => {
        focusedRef.current = true;
        // Clear "0" so the user types a fresh number instead of appending
        if (localVal === '0') {
          setLocalVal('');
        } else {
          e.target.select();
        }
      }}
      onChange={(e) => {
        const filtered = e.target.value.replace(/\D/g, '');
        setLocalVal(filtered);
      }}
      onBlur={() => {
        focusedRef.current = false;
        const num  = parseInt(localVal || '0', 10);
        const safe = isNaN(num) ? 0 : num;
        setLocalVal(String(safe));
        onChange(safe); // 0 → parent sets qty=0 → controls hide
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') e.currentTarget.blur();
      }}
    />
  );
}
