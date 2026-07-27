import { PgStr } from "./PgStr";
import { NavBtn } from "../NavBtn/NavBtn";
import { ArrIco } from "../icons/ArrIco";
import "./NvCtl.css";

interface NcPr {
  curPg: number;
  ttlPg: number;
  onPrev: () => void;
  onNext: () => void;
  onGoto: (pg: number) => void;
}

export function NvCtl({ curPg, ttlPg, onPrev, onNext, onGoto }: NcPr) {
  return (
    <div className="navc-wrap glass no-print">
      <NavBtn disabled={curPg === 0}          onClick={onPrev} className="navc-arr">
        <ArrIco dir="prev" />
      </NavBtn>
      <PgStr cur={curPg} total={ttlPg} onGoto={onGoto} />
      <NavBtn disabled={curPg === ttlPg - 1}  onClick={onNext} className="navc-arr">
        <ArrIco dir="next" />
      </NavBtn>
    </div>
  );
}
