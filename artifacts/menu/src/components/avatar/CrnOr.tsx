import './CrnOr.css';

/** Four L-bracket corner ornaments rendered inside the plaque container. */
export function CrnOr() {
  const svg = (
    <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      {/* Main L-bracket — rounded inner corner */}
      <path
        d="M 25.5 2.5 H 5 Q 2.5 2.5 2.5 5 V 25.5"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="square"
      />
      {/* End tick — horizontal arm terminus */}
      <line x1="25.5" y1="0.8" x2="25.5" y2="4.5"
        stroke="currentColor" strokeWidth="1.1" strokeLinecap="square" />
      {/* End tick — vertical arm terminus */}
      <line x1="0.8" y1="25.5" x2="4.5" y2="25.5"
        stroke="currentColor" strokeWidth="1.1" strokeLinecap="square" />
      {/* Accent dot at corner junction */}
      <circle cx="2.5" cy="2.5" r="1.1" fill="currentColor" />
    </svg>
  );

  return (
    <>
      <span className="plq-cnr plq-cnr-tl">{svg}</span>
      <span className="plq-cnr plq-cnr-tr">{svg}</span>
      <span className="plq-cnr plq-cnr-br">{svg}</span>
      <span className="plq-cnr plq-cnr-bl">{svg}</span>
    </>
  );
}
