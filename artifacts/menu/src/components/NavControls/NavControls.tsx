import React from "react";
import { NavButton } from "../NavButton/NavButton";
import "./NavControls.css";

interface NavControlsProps {
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}

export function NavControls({ currentPage, totalPages, onPrev, onNext }: NavControlsProps) {
  return (
    <div className="no-print nav-wrap f-aic">
      <NavButton direction="prev" onClick={onPrev} disabled={currentPage === 0} />
      <div className="nav-dot rnd" />
      <NavButton direction="next" onClick={onNext} disabled={currentPage === totalPages - 1} />
    </div>
  );
}
