import { type ReactNode } from "react";
import "./MnBrd.css";

interface MbPr {
  pg?: number | false;
  children?: ReactNode;
}

const B = import.meta.env.BASE_URL;

function MnBrd({ pg = 1, children }: MbPr) {
  const pgNum = pg !== false ? String(pg).padStart(2, "0") : null;

  return (
    <div className="mb-wrap">
      {/* Page background image — full-bleed behind content */}
      <img
        src={`${B}img/pgbg.png`}
        className="mb-bg"
        aria-hidden="true"
        alt=""
      />

      {/* Page content */}
      <div className="mb-body flex flex-col w-full h-full">{children}</div>

      {/* Border frame overlay — sits above content */}
      <img
        src={`${B}img/brd.png`}
        className="mb-brd"
        aria-hidden="true"
        alt=""
      />

      {/* Top ornament */}
      <img
        src={`${B}img/ornt.png`}
        className="mb-ornt mb-ornt-t"
        aria-hidden="true"
        alt=""
      />

      {/* Page number */}
      {pgNum !== null && (
        <span className="mb-pgn ff-s" aria-hidden="true">{pgNum}</span>
      )}
    </div>
  );
}

export default MnBrd;
