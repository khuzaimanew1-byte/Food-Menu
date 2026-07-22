import React from "react";
import "../Button/base.css";
import "../Button/icon-text.css";
import { PrintIcon } from "../Button/icons/PrintIcon";

export function PrintBtn() {
  return (
    <button
      className="btn btit glass no-print"
      onClick={() => window.print()}
      aria-label="Print menu"
    >
      <PrintIcon className="btit-ico" />
      <span className="btit-lbl">Print</span>
    </button>
  );
}
