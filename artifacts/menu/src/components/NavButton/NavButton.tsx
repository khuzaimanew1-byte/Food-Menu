import React from "react";
import "../Button/base.css";
import "../Button/icon-only.css";

interface NavBtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function NavButton({ disabled, children, className, ...props }: NavBtnProps) {
  return (
    <button
      disabled={disabled}
      className={`btn btio no-print${disabled ? " disabled" : ""}${className ? " " + className : ""}`}
      {...props}
    >
      {children}
    </button>
  );
}
