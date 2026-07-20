import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./NavButton.css";

interface NavButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  direction: "prev" | "next";
}

export function NavButton({ direction, disabled, ...props }: NavButtonProps) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;
  return (
    <button disabled={disabled} className="nav-btn no-print" {...props}>
      <Icon className="nav-ico" strokeWidth={2} />
    </button>
  );
}
