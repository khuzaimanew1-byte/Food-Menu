import './Inits.css';

interface InitsPr {
  name?: string;
}

// Curated luxury hues: amber · gold · teal · violet · rose · emerald · crimson · navy
const HUES = [28, 43, 195, 265, 340, 155, 0, 220];

/** Extract ≤2 uppercase initials from name; fallback "AV" */
function getInits(name?: string): string {
  const str = name?.trim();
  if (!str) return 'AV';
  const words = str.split(/\s+/);
  if (words.length === 1) return words[0][0].toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

/** Stable hue from name — same name always maps to same colour */
function getAvatarHue(name?: string): number {
  const str = name?.trim() || 'AV';
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (str.charCodeAt(i) + ((h << 5) - h)) | 0;
  }
  return HUES[Math.abs(h) % HUES.length];
}

export function Inits({ name }: InitsPr) {
  const hue = getAvatarHue(name);
  return (
    <div
      className="ini ini-bg"
      // --avt-h drives both the gradient bg and the text-shadow glow
      style={{ '--avt-h': String(hue) } as React.CSSProperties}
      aria-hidden
    >
      <span className="ini-txt">{getInits(name)}</span>
    </div>
  );
}
