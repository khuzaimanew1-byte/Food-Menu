import "./DmIco.css";

interface DiPr { active?: boolean; }

export function DmIco({ active }: DiPr) {
  return (
    <svg
      className={`dot-svg${active ? " dot-act" : ""}`}
      viewBox="-7 -7 14 14"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <polygon className="dot-dmnd" points="0,-5 5,0 0,5 -5,0" />
    </svg>
  );
}
