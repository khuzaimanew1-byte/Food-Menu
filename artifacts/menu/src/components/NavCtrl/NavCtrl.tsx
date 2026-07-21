import React, { useRef, useEffect } from "react";
import "./NavCtrl.css";

interface NavCtrlProps {
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  onGoto: (page: number) => void;
}

/**
 * Angular arrow button — diamond-arrowhead + line motif, directly
 * echoing the navigation diamonds in MenuBorder's page-number decoration.
 */
function NavArr({
  dir,
  disabled,
  onClick,
}: {
  dir: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  const isPrev = dir === "prev";
  return (
    <button
      className={`navc-arr navc-btn${disabled ? " navc-off" : ""}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={isPrev ? "Previous page" : "Next page"}
    >
      <svg
        className="arr-svg"
        viewBox="0 0 40 40"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        {isPrev ? (
          <>
            {/* Diamond arrowhead pointing left — tip at x=8 */}
            <polygon className="arr-fill" points="8,20 15,13 22,20 15,27" />
            {/* Line from diamond back to right edge, echoing MenuBorder nav line */}
            <line className="arr-line" x1="22" y1="20" x2="34" y2="20" />
            {/* Terminal dot */}
            <circle className="arr-dot" cx="34" cy="20" r="2.2" />
            {/* Upper angular bracket arm */}
            <polyline className="arr-brk" points="8,10 8,8 16,8" />
            {/* Lower angular bracket arm */}
            <polyline className="arr-brk" points="8,30 8,32 16,32" />
          </>
        ) : (
          <>
            {/* Diamond arrowhead pointing right — tip at x=32 */}
            <polygon className="arr-fill" points="32,20 25,13 18,20 25,27" />
            {/* Line from diamond back to left edge */}
            <line className="arr-line" x1="18" y1="20" x2="6" y2="20" />
            {/* Terminal dot */}
            <circle className="arr-dot" cx="6" cy="20" r="2.2" />
            {/* Upper angular bracket arm */}
            <polyline className="arr-brk" points="32,10 32,8 24,8" />
            {/* Lower angular bracket arm */}
            <polyline className="arr-brk" points="32,30 32,32 24,32" />
          </>
        )}
      </svg>
    </button>
  );
}

/**
 * Page indicator strip — one diamond per page, scrollable if needed.
 * Active diamond is filled + glowing; inactive is outlined + faded.
 */
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

  // Keep active indicator centred in view on page change
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
          className={`pg-dot navc-btn${i === current ? " pg-act" : ""}`}
          onClick={() => onGoto(i)}
          aria-label={`Go to page ${i + 1}`}
          aria-current={i === current ? "page" : undefined}
        >
          <svg
            className="dot-svg"
            viewBox="-7 -7 14 14"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            {/* Diamond motif — same accent as MenuBorder decorative diamonds */}
            <polygon className="dot-dmnd" points="0,-5 5,0 0,5 -5,0" />
          </svg>
        </button>
      ))}
    </div>
  );
}

export function NavCtrl({
  currentPage,
  totalPages,
  onPrev,
  onNext,
  onGoto,
}: NavCtrlProps) {
  return (
    <div className="navc-wrap no-print flex items-center">
      <NavArr dir="prev" disabled={currentPage === 0} onClick={onPrev} />
      <PgStrip current={currentPage} total={totalPages} onGoto={onGoto} />
      <NavArr dir="next" disabled={currentPage === totalPages - 1} onClick={onNext} />
    </div>
  );
}
