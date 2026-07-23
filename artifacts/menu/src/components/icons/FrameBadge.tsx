import React from "react";
import "./FrameBadge.css";

interface FrameBadgeProps {
  num?: number | string;
}

export function FrameBadge({ num }: FrameBadgeProps) {
  return (
    <div className="bdgi" aria-hidden={num === undefined ? true : undefined}>
      <span className="bdgi-c bdgi-tl-h" />
      <span className="bdgi-c bdgi-tl-v" />
      <span className="bdgi-c bdgi-tr-h" />
      <span className="bdgi-c bdgi-tr-v" />
      <span className="bdgi-c bdgi-bl-h" />
      <span className="bdgi-c bdgi-bl-v" />
      <span className="bdgi-c bdgi-br-h" />
      <span className="bdgi-c bdgi-br-v" />
      {num !== undefined && <span className="bdgi-num ff-s">{num}</span>}
    </div>
  );
}
