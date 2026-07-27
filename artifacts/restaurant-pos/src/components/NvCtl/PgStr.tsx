import { useRef, useEffect } from "react";
import { DmIco } from "../icons/DmIco";

interface PsPr {
  cur: number;
  total: number;
  onGoto: (p: number) => void;
}

export function PgStr({ cur, total, onGoto }: PsPr) {
  const stRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const strip = stRef.current;
    if (!strip) return;
    const dot = strip.children[cur] as HTMLElement | undefined;
    dot?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [cur]);

  return (
    <div className="pg-strip" ref={stRef} role="group" aria-label="Page indicators">
      {Array.from({ length: total }, (_, i) => (
        <button
          key={`dot-${i}`}
          className="pg-dot"
          onClick={() => onGoto(i)}
          aria-label={`Go to page ${i + 1}`}
          aria-current={i === cur ? "page" : undefined}
        >
          <DmIco active={i === cur} />
        </button>
      ))}
    </div>
  );
}
