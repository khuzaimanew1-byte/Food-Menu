import './QuantityInput.css';

interface QtyInpPr {
  value: number;
}

export function QuantityInput({ value }: QtyInpPr) {
  return (
    <span className="qty-inp" aria-live="polite" aria-label={`Quantity: ${value}`}>
      {value}
    </span>
  );
}
