import React, { useId } from "react";
import { ChevronLeft, ChevronRight, Printer } from "lucide-react";
import "./CtrlDock.css";

interface CtrlDockProps {
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}

/** Simplified corner-bracket echo from MenuBorder — scaled to fill button */
function BrktBg({ flip }: { flip?: boolean }) {
  return (
    <svg
      className="brkt-svg"
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
      {/* Outer L — main bracket */}
      <polyline className="brkt-s" points="28,6 6,6 6,28" />
      {/* Thin echo lines */}
      <line className="brkt-t" x1="3" y1="3" x2="3" y2="31" />
      <line className="brkt-t" x1="3" y1="3" x2="31" y2="3" />
      {/* Inner square motif */}
      <rect className="brkt-s" x="11" y="11" width="8" height="8" />
      <rect className="brkt-f" x="14" y="14" width="2" height="2" />
      {/* Inner L echo */}
      <polyline className="brkt-t" points="24,11 24,24 11,24" />
    </svg>
  );
}

/** Infinity-glyph page progress indicator */
function InfProg({ current, total, uid }: { current: number; total: number; uid: string }) {
  // Fill fraction: page 1 of N → 1/N … page N → N/N
  const fill = (current + 1) / total;
  // ∞ path: continuous stroke through both loops starting from center crossing
  const d =
    "M 0,0 C 5,-10 20,-10 20,0 C 20,10 5,10 0,0 C -5,-10 -20,-10 -20,0 C -20,10 -5,10 0,0";

  return (
    <svg
      className="inf-svg"
      viewBox="-25 -13 50 26"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <filter id={`iglow-${uid}`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Faded full ∞ behind */}
      <path className="inf-bg" d={d} />
      {/* Active filled portion */}
      <path
        className="inf-act"
        d={d}
        pathLength="100"
        strokeDasharray="100"
        strokeDashoffset={100 - fill * 100}
        filter={`url(#iglow-${uid})`}
      />
    </svg>
  );
}

/** Circular halo ring echoing the crown-emblem motif, frames print icon */
function HaloRing() {
  return (
    <svg
      className="halo-svg"
      viewBox="-18 -18 36 36"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {/* Outer ring */}
      <circle className="halo-o" cx="0" cy="0" r="15.5" />
      {/* Inner ring */}
      <circle className="halo-i" cx="0" cy="0" r="11" />
      {/* Cardinal tick marks */}
      {[0, 90, 180, 270].map((deg) => (
        <line
          key={deg}
          className="halo-mk"
          x1="0"
          y1="-12.5"
          x2="0"
          y2="-15"
          transform={`rotate(${deg})`}
        />
      ))}
      {/* Diagonal fill dots */}
      {[45, 135, 225, 315].map((deg) => (
        <circle
          key={deg}
          className="halo-dot"
          cx="0"
          cy="-13.5"
          r="0.9"
          transform={`rotate(${deg})`}
        />
      ))}
    </svg>
  );
}

export function CtrlDock({ currentPage, totalPages, onPrev, onNext }: CtrlDockProps) {
  const uid = useId().replace(/:/g, "");
  const isPrevOff = currentPage === 0;
  const isNextOff = currentPage === totalPages - 1;

  return (
    <div className="ctrl-dock no-print flex items-center">
      {/* Prev */}
      <button
        className={`dock-btn dock-nav${isPrevOff ? " dock-off" : ""}`}
        onClick={onPrev}
        disabled={isPrevOff}
        aria-label="Previous page"
      >
        <BrktBg flip />
        <ChevronLeft className="dock-chev" strokeWidth={1.5} />
      </button>

      {/* Infinity progress */}
      <div className="dock-inf">
        <InfProg current={currentPage} total={totalPages} uid={uid} />
      </div>

      {/* Dot divider — same style as tagline separator */}
      <span className="dock-sep" aria-hidden>•</span>

      {/* Print */}
      <button className="dock-btn dock-prnt" onClick={() => window.print()} aria-label="Print menu">
        <HaloRing />
        <Printer className="dock-pico" strokeWidth={1.5} />
      </button>

      {/* Next */}
      <button
        className={`dock-btn dock-nav${isNextOff ? " dock-off" : ""}`}
        onClick={onNext}
        disabled={isNextOff}
        aria-label="Next page"
      >
        <BrktBg />
        <ChevronRight className="dock-chev" strokeWidth={1.5} />
      </button>
    </div>
  );
}
