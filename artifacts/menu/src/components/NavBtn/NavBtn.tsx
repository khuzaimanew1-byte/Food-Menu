import "../Button/base.css";
import "../Button/ico-on.css";
import type { ButtonHTMLAttributes } from "react";

interface NbPr extends ButtonHTMLAttributes<HTMLButtonElement> {}

export function NavBtn({ disabled, children, className, ...props }: NbPr) {
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
