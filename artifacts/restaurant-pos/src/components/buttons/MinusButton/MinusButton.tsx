import './MinusButton.css';

interface MinusBtnPr {
  onClick: (e: React.MouseEvent) => void;
}

export function MinusButton({ onClick }: MinusBtnPr) {
  return (
    <button className="minus-btn" onClick={onClick} aria-label="Decrease quantity">
      <svg className="minus-ico" viewBox="0 0 24 24" aria-hidden>
        <line x1="5" y1="12" x2="19" y2="12"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </button>
  );
}
