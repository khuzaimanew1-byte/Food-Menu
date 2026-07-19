import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface NavButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  direction: "prev" | "next";
}

export function NavButton({ direction, disabled, ...props }: NavButtonProps) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;
  
  return (
    <button
      disabled={disabled}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '44px',
        height: '44px',
        borderRadius: '50%',
        border: '1.5px solid rgba(212,175,55,0.5)',
        backgroundColor: disabled ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.4)',
        backdropFilter: 'blur(4px)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.3 : 1,
        transition: 'all 0.2s ease',
        outline: 'none',
      }}
      className="nav-btn no-print"
      {...props}
    >
      <style>{`
        .nav-btn:not(:disabled):hover {
          border-color: rgba(212,175,55,0.9) !important;
          background-color: rgba(212,175,55,0.1) !important;
        }
      `}</style>
      <Icon style={{ color: '#d4af37', width: '20px', height: '20px', strokeWidth: 2 }} />
    </button>
  );
}
