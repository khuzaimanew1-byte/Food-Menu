import React from "react";
import { Printer } from "lucide-react";
import "./PrintBtn.css";

/**
 * Print action button — pill shape, icon + "Print" label, fixed to the
 * bottom-right corner of the viewport. Visually independent from the menu box.
 */
export function PrintBtn() {
  return (
    <button
      className="prnt-btn glass no-print"
      onClick={() => window.print()}
      aria-label="Print menu"
    >
      <Printer className="prnt-ico" aria-hidden />
      <span className="prnt-lbl">Print</span>
    </button>
  );
}
