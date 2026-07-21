import React from "react";
import "./PrintBtn.css";

/**
 * Floating print button — angular bracket-frame style echoing MenuBorder corner motif.
 * Positioned above the top-right of the A4 box, overlapping by ~50%.
 */
export function PrintBtn() {
  return (
    <button
      className="prnt-btn no-print"
      onClick={() => window.print()}
      aria-label="Print menu"
    >
      <svg
        className="prnt-svg"
        viewBox="0 0 44 44"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        {/* ── Outer bracket frame (corner-bracket family) ── */}
        {/* Top-left L */}
        <polyline className="pb-gs" points="22,4 4,4 4,22" />
        {/* Bottom-right L */}
        <polyline className="pb-gs" points="22,40 40,40 40,22" />
        {/* Thin echo lines */}
        <line className="pb-gt" x1="2" y1="2" x2="2" y2="24" />
        <line className="pb-gt" x1="2" y1="2" x2="24" y2="2" />
        <line className="pb-gt" x1="42" y1="42" x2="42" y2="20" />
        <line className="pb-gt" x1="42" y1="42" x2="20" y2="42" />
        {/* Corner accent dots */}
        <rect className="pb-gf" x="1" y="23" width="2.5" height="2.5" />
        <rect className="pb-gf" x="23" y="1" width="2.5" height="2.5" />
        <rect className="pb-gf" x="40.5" y="19" width="2.5" height="2.5" />
        <rect className="pb-gf" x="19" y="40.5" width="2.5" height="2.5" />

        {/* ── Document / print icon (geometric, not rounded) ── */}
        {/* Page body */}
        <rect className="pb-gs" x="12" y="11" width="16" height="20" />
        {/* Folded top-right corner */}
        <polyline className="pb-gt" points="23,11 28,11 28,16 23,16 23,11" />
        <line className="pb-gt" x1="23" y1="11" x2="28" y2="16" />
        {/* Content lines */}
        <line className="pb-gl" x1="15" y1="21" x2="25" y2="21" />
        <line className="pb-gl" x1="15" y1="25" x2="22" y2="25" />
      </svg>
    </button>
  );
}
