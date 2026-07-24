import './Inits.css';

interface InitsPr {
  name?: string;
}

/** Extract ≤2 uppercase initials from name; fallback "AV" */
function getInits(name?: string): string {
  const str = name?.trim();
  if (!str) return 'AV';
  const words = str.split(/\s+/);
  if (words.length === 1) return words[0][0].toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

export function Inits({ name }: InitsPr) {
  return (
    <div className="ini ini-bg" aria-hidden>
      <span className="ini-txt">{getInits(name)}</span>
    </div>
  );
}
