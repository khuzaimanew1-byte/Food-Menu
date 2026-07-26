import './ClsIco.css';

interface ClsIcoPr { className?: string; }

export function ClsIco({ className }: ClsIcoPr) {
  return (
    <svg
      className={`cls-ico${className ? ` ${className}` : ''}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <line x1="18" y1="6" x2="6"  y2="18" />
      <line x1="6"  y1="6" x2="18" y2="18" />
    </svg>
  );
}
