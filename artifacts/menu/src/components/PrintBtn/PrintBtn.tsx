import React from "react";
import "./PrintBtn.css";

/**
 * Print action button — angular style, pinned to the top-right corner of the page.
 * Shows a printer icon + "PRINT" label; rectangular, not round.
 */
export function PrintBtn() {
  return (
    <button
      className="prnt-btn no-print"
      onClick={() => window.print()}
      aria-label="Print menu"
    >
      {/* Printer icon */}
      <svg
        className="prnt-icon"
        viewBox="0 0 22 22"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        {/* Paper feed top */}
        <rect className="pi-gs" x="5" y="2" width="12" height="6" />
        {/* Printer body */}
        <rect className="pi-gm" x="2" y="8" width="18" height="9" />
        {/* Output paper */}
        <rect className="pi-gs" x="5" y="13" width="12" height="7" />
        {/* Ink dots on printer body */}
        <circle className="pi-gf" cx="16" cy="12.5" r="1" />
        <circle className="pi-gf" cx="13" cy="12.5" r="1" />
        {/* Paper lines on output */}
        <line className="pi-gl" x1="7.5" y1="16" x2="14.5" y2="16" />
        <line className="pi-gl" x1="7.5" y1="18" x2="12" y2="18" />
      </svg>

      {/* Label */}
      <span className="prnt-label">PRINT</span>
    </button>
  );
}
