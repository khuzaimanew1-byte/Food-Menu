import React, { useRef, useEffect } from "react";
import { NavButton } from "../NavButton/NavButton";
import { ArrowIcon } from "../Button/icons/ArrowIcon";
import "./NavCtrl.css";

interface NavCtrlProps {
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  onGoto: (page: number) => void;
}

function PgStrip({
  current,
  total,
  onGoto,
}: {
  current: number;
  total: number;
  onGoto: (p: number) => void;
}) {
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const dot = strip.children[current] as HTMLElement | undefined;
    dot?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [current]);

  return (
    <div className="pg-strip" ref={stripRef} role="group" aria-label="Page indicators">
      {Array.from({ length: total }, (_, i) => (
        <button
          key={i}
          className={`pg-dot${i === current ? " pg-act" : ""}`}
          onClick={() => onGoto(i)}
          aria-label={`Go to page ${i + 1}`}
          aria-current={i === current ? "page" : undefined}
        >
          <svg className="dot-svg" viewBox="-7 -7 14 14" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <polygon className="dot-dmnd" points="0,-5 5,0 0,5 -5,0" />
          </svg>
        </button>
      ))}
    </div>
  );
}

export function NavCtrl({ currentPage, totalPages, onPrev, onNext, onGoto }: NavCtrlProps) {
  return (
    <div className="navc-wrap glass no-print">
      <NavButton
        disabled={currentPage === 0}
        onClick={onPrev}
        className="navc-arr"
      >
        <ArrowIcon dir="prev" />
      </NavButton>

      <PgStrip current={currentPage} total={totalPages} onGoto={onGoto} />

      <NavButton
        disabled={currentPage === totalPages - 1}
        onClick={onNext}
        className="navc-arr"
      >
        <ArrowIcon dir="next" />
      </NavButton>
    </div>
  );
}
