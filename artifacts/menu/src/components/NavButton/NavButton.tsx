import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./NavButton.css";

interface NavButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  direction: "prev" | "next";
}

export function NavButton({ direction, disabled, children, className, ...props }: NavButtonProps) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;
  return (
    <button
      disabled={disabled}
      className={`nav-btn flex items-center justify-center cursor-pointer no-print${disabled ? " disabled" : ""}${className ? " " + className : ""}`}
      {...props}
    >
      {children ?? <Icon className="nav-ico" strokeWidth={2} />}
    </button>
  );
}
