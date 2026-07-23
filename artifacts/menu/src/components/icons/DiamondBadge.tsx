import React from "react";
import "./DiamondBadge.css";

interface DiamondBadgeProps {
  num?: number | string;
}

export function DiamondBadge({ num }: DiamondBadgeProps) {
  return (
    <div className="dmbdg" aria-hidden={num === undefined ? true : undefined}>
      {num !== undefined && <span className="dmbdg-num ff-s">{num}</span>}
    </div>
  );
}
