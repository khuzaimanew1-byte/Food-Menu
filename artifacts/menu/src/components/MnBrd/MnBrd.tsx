import { useId, type ReactNode } from "react";
import "./MnBrd.css";

interface MbPr {
  pg?: number | false;
  children?: ReactNode;
}

function MnBrd({ pg = 1, children }: MbPr) {
  const uid   = useId().replace(/:/g, "");
  const crnId = `corner-tl-${uid}`;
  const pgNum = pg !== false ? String(pg).padStart(2, "0") : null;

  return (
    <div className="mb-wrap">
      <svg
        className="mb-svg absolute inset-0 w-full h-full"
        viewBox="0 0 1054 1492"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <g id={crnId}>
            <polyline className="mb-gs"         points="45,115 45,45 115,45" />
            <rect     className="mb-gf"         height="4" width="4" x="43"   y="118" />
            <rect     className="mb-gf"         height="4" width="4" x="118"  y="43" />
            <line     className="mb-gs mb-th"   x1="35"  x2="35"  y1="35"  y2="125" />
            <line     className="mb-gs mb-th"   x1="35"  x2="125" y1="35"  y2="35" />
            <line     className="mb-gs mb-th"   x1="25"  x2="25"  y1="25"  y2="135" />
            <line     className="mb-gs mb-th"   x1="25"  x2="135" y1="25"  y2="25" />
            <line     className="mb-gs"         x1="15"  x2="15"  y1="15"  y2="145" />
            <line     className="mb-gs"         x1="15"  x2="145" y1="15"  y2="15" />
            <rect     className="mb-gs mb-th"   height="30" width="30" x="55" y="55" />
            <rect     className="mb-gs"         height="14" width="14" x="63" y="63" />
            <rect     className="mb-gf"         height="4"  width="4"  x="68" y="68" />
            <polyline className="mb-gs"         points="95,55 95,95 55,95" />
            <rect     className="mb-gf"         height="3" width="3" x="93.5" y="50" />
            <rect     className="mb-gf"         height="3" width="3" x="50"   y="93.5" />
          </g>
        </defs>
        <rect className="mb-gs mb-th" height="1432" width="994" x="30" y="30" />
        <use href={`#${crnId}`} x="0" y="0" />
        <use href={`#${crnId}`} transform="translate(1054,0) scale(-1,1)"    x="0" y="0" />
        <use href={`#${crnId}`} transform="translate(0,1492) scale(1,-1)"    x="0" y="0" />
        <use href={`#${crnId}`} transform="translate(1054,1492) scale(-1,-1)" x="0" y="0" />
        {pgNum !== null && (
          <g transform="translate(527,1422)">
            <path   className="mb-gs mb-th" d="M 0,-40 C 25,-40 35,-20 45,0 C 35,20 25,40 0,40 C -25,40 -35,20 -45,0 C -35,-20 -25,-40 0,-40 Z" />
            <text   x="0" y="1" textAnchor="middle" dominantBaseline="middle" className="mb-pgn">{pgNum}</text>
            <line   className="mb-gs mb-th" x1="-45"  x2="-230" y1="0" y2="0" />
            <circle className="mb-gf"       cx="-52"  cy="0"     r="2.5" />
            <circle className="mb-gf"       cx="-240" cy="0"     r="3" />
            <path   className="mb-gs mb-th" d="M -240,-10 L -250,0 L -240,10 L -230,0 Z" />
            <line   className="mb-gs mb-th" x1="45"   x2="230"  y1="0" y2="0" />
            <circle className="mb-gf"       cx="52"   cy="0"     r="2.5" />
            <circle className="mb-gf"       cx="240"  cy="0"     r="3" />
            <path   className="mb-gs mb-th" d="M 240,-10 L 250,0 L 240,10 L 230,0 Z" />
          </g>
        )}
      </svg>
      <div className="mb-body flex flex-col w-full h-full">{children}</div>
    </div>
  );
}

export default MnBrd;
