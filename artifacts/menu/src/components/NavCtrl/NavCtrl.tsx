import React, { useRef, useEffect } from "react";
import { NavButton } from "../NavButton/NavButton";
import "./NavCtrl.css";

interface NavCtrlProps {
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  onGoto: (page: number) => void;
}

/**
 * Diamond arrowhead SVG — echoes MenuBorder's page-nav diamond motif.
 * Rendered as the child of NavButton so arrow button logic stays in one place.
 */
function ArrIcon({ dir }: { dir: "prev" | "next" }) {
  const isPrev = dir === "prev";
  return (
    <svg className="arr-svg" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      {isPrev ? (
        <>
          <polygon className="arr-fill" points="8,20 15,13 22,20 15,27" />
          <line className="arr-line" x1="22" y1="20" x2="34" y2="20" />
          <circle className="arr-dot" cx="34" cy="20" r="2.2" />
          <polyline className="arr-brk" points="8,10 8,8 16,8" />
          <polyline className="arr-brk" points="8,30 8,32 16,32" />
        </>
      ) : (
        <>
          <polygon className="arr-fill" points="32,20 25,13 18,20 25,27" />
          <line className="arr-line" x1="18" y1="20" x2="6" y2="20" />
          <circle className="arr-dot" cx="6" cy="20" r="2.2" />
          <polyline className="arr-brk" points="32,10 32,8 24,8" />
          <polyline className="arr-brk" points="32,30 32,32 24,32" />
        </>
      )}
    </svg>
  );
}

/**
 * Page indicator strip — one diamond per page, scrollable when many pages.
 * Active: filled gold + glow. Inactive: outlined, full opacity (still clickable).
 */
function PgStrip({
  current,
  total,
  onGoto,
}: {
  current: number;
  total: number;
  onGoto: (p: number) => void;
}) {
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const dot = strip.children[current] as HTMLElement | undefined;
    dot?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [current]);

  return (
    <div className="pg-strip" ref={stripRef} role="group" aria-label="Page indicators">
      {Array.from({ length: total }, (_, i) => (
        <button
          key={i}
          className={`pg-dot${i === current ? " pg-act" : ""}`}
          onClick={() => onGoto(i)}
          aria-label={`Go to page ${i + 1}`}
          aria-current={i === current ? "page" : undefined}
        >
          <svg className="dot-svg" viewBox="-7 -7 14 14" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <polygon className="dot-dmnd" points="0,-5 5,0 0,5 -5,0" />
          </svg>
        </button>
      ))}
    </div>
  );
}

export function NavCtrl({ currentPage, totalPages, onPrev, onNext, onGoto }: NavCtrlProps) {
  return (
    <div className="navc-wrap glass no-print">
      <NavButton
        direction="prev"
        disabled={currentPage === 0}
        onClick={onPrev}
        className="navc-arr"
      >
        <ArrIcon dir="prev" />
      </NavButton>

      <PgStrip current={currentPage} total={totalPages} onGoto={onGoto} />

      <NavButton
        direction="next"
        disabled={currentPage === totalPages - 1}
        onClick={onNext}
        className="navc-arr"
      >
        <ArrIcon dir="next" />
      </NavButton>
    </div>
  );
}
