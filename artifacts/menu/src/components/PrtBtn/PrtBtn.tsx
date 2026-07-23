import "../btn/base.css";
import "../btn/ico-tx.css";
import { PrtIco } from "../icons/PrtIco";

export function PrtBtn() {
  return (
    <button
      className="btn btit glass no-print"
      onClick={() => window.print()}
      aria-label="Print menu"
    >
      <PrtIco className="btit-ico" />
      <span className="btit-lbl">Print</span>
    </button>
  );
}
