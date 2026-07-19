import React from "react";
import { NavButton } from "./NavButton";

interface NavControlsProps {
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}

export function NavControls({ currentPage, totalPages, onPrev, onNext }: NavControlsProps) {
  return (
    <div className="no-print" style={{
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      zIndex: 100,
      flexShrink: 0,
    }}>
      <NavButton direction="prev" onClick={onPrev} disabled={currentPage === 0} />
      <div style={{
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        backgroundColor: '#d4af37',
        opacity: 0.7
      }} />
      <NavButton direction="next" onClick={onNext} disabled={currentPage === totalPages - 1} />
    </div>
  );
}
