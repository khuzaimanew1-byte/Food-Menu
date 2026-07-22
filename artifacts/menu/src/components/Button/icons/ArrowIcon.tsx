import React from "react";

interface ArrowIconProps {
  dir: "prev" | "next";
}

export function ArrowIcon({ dir }: ArrowIconProps) {
  return (
    <svg
      className={`arr-svg${dir === "prev" ? " arr-flip" : ""}`}
      viewBox="0 0 40 40"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <polygon className="arr-fill" points="32,20 25,13 18,20 25,27" />
      <line    className="arr-line" x1="18" y1="20" x2="6"  y2="20" />
      <circle  className="arr-dot"  cx="6"  cy="20" r="2.2" />
      <polyline className="arr-brk" points="32,10 32,8 24,8"  />
      <polyline className="arr-brk" points="32,30 32,32 24,32" />
    </svg>
  );
}
