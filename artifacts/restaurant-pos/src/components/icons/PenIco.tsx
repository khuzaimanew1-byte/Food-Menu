/* ── PenIco — pencil / edit icon ────────────────────────────────────────── */

interface PenIcoPr { cls?: string; }

export function PenIco({ cls }: PenIcoPr) {
  return (
    <svg className={cls} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M11.013 1.427a1.75 1.75 0 0 1 2.474 2.474L4.877 12.61a1.75 1.75 0 0 1-.756.445l-3.251.93a.75.75 0 0 1-.929-.929l.929-3.251c.081-.286.235-.546.445-.756l8.698-8.622Z"
        stroke="currentColor" strokeWidth="1.25"
        strokeLinecap="round" strokeLinejoin="round"
      />
      <line x1="9.5" y1="2.94" x2="13.06" y2="6.5"
        stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"
      />
    </svg>
  );
}
