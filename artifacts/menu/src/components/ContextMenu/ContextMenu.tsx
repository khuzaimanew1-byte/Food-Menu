import { Fragment, useState, useEffect, useRef, useCallback } from 'react';
import { MENU_CONFIG, detectArea } from './contextMenuConfig';
import type { CtxArea, CtxOpt } from './contextMenuConfig';
import './ContextMenu.css';

// ─── Types ────────────────────────────────────────────────────────────────────

interface MenuState {
  left:    number;
  top:     number;
  area:    CtxArea;
  id:      string | null;
  options: CtxOpt[];
}

interface CtxMenuPr {
  onSelect?: (area: CtxArea, id: string | null, optId: string) => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const LONG_PRESS_MS  = 500;
const MENU_W         = 200;   // px — matches width in CSS
const OPT_H          = 34;    // px per option row
const SEP_H          = 7;     // px per separator rule
const PADDING_V      = 5;     // px — top + bottom padding (tray inset)
const CURSOR_OFFSET  = 10;    // px — gap from pointer

// ─── Helpers ──────────────────────────────────────────────────────────────────

function calcPos(x: number, y: number, opts: CtxOpt[]) {
  const sepCount = opts.filter(o => o.separator).length;
  const menuH    = opts.length * OPT_H + sepCount * SEP_H + PADDING_V * 2;
  const vpW      = window.innerWidth;
  const vpH      = window.innerHeight;
  const MARGIN   = 8;
  const rawLeft  = x + MENU_W + CURSOR_OFFSET > vpW
    ? x - MENU_W - CURSOR_OFFSET : x + CURSOR_OFFSET;
  const rawTop   = y + menuH + CURSOR_OFFSET > vpH
    ? y - menuH - CURSOR_OFFSET : y + CURSOR_OFFSET;
  return {
    left: Math.max(MARGIN, Math.min(rawLeft, vpW - MENU_W - MARGIN)),
    top:  Math.max(MARGIN, Math.min(rawTop,  vpH - menuH  - MARGIN)),
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ContextMenu({ onSelect }: CtxMenuPr) {
  const [state, setState] = useState<MenuState | null>(null);
  const menuRef     = useRef<HTMLDivElement>(null);
  const activeElRef = useRef<HTMLElement | null>(null);
  const lpTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lpOriginRef = useRef({ x: 0, y: 0 });

  // ── Highlight helpers ──────────────────────────────────────────────────────
  const setActive = useCallback((el: HTMLElement | null) => {
    activeElRef.current?.removeAttribute('data-ctx-active');
    el?.setAttribute('data-ctx-active', '');
    activeElRef.current = el;
  }, []);

  // ── Open ───────────────────────────────────────────────────────────────────
  const open = useCallback((x: number, y: number, target: EventTarget | null) => {
    const hit = detectArea(target);
    if (!hit) return;
    const { area, id, el } = hit;
    const options = MENU_CONFIG[area];
    if (!options?.length) return;
    setActive(el);
    setState({ ...calcPos(x, y, options), area, id, options });
  }, [setActive]);

  // ── Close ──────────────────────────────────────────────────────────────────
  const close = useCallback(() => {
    setActive(null);
    setState(null);
  }, [setActive]);

  // ── Right-click ────────────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => { e.preventDefault(); open(e.clientX, e.clientY, e.target); };
    document.addEventListener('contextmenu', handler);
    return () => document.removeEventListener('contextmenu', handler);
  }, [open]);

  // ── Long-press (touch / stylus) ────────────────────────────────────────────
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') return;
      lpOriginRef.current = { x: e.clientX, y: e.clientY };
      if (lpTimerRef.current) clearTimeout(lpTimerRef.current);
      lpTimerRef.current = setTimeout(() => open(e.clientX, e.clientY, e.target), LONG_PRESS_MS);
    };
    const onMove = (e: PointerEvent) => {
      const { x, y } = lpOriginRef.current;
      if (Math.abs(e.clientX - x) > 8 || Math.abs(e.clientY - y) > 8)
        if (lpTimerRef.current) clearTimeout(lpTimerRef.current);
    };
    const onUp = () => { if (lpTimerRef.current) clearTimeout(lpTimerRef.current); };

    document.addEventListener('pointerdown',   onDown);
    document.addEventListener('pointermove',   onMove);
    document.addEventListener('pointerup',     onUp);
    document.addEventListener('pointercancel', onUp);
    return () => {
      if (lpTimerRef.current) clearTimeout(lpTimerRef.current);
      document.removeEventListener('pointerdown',   onDown);
      document.removeEventListener('pointermove',   onMove);
      document.removeEventListener('pointerup',     onUp);
      document.removeEventListener('pointercancel', onUp);
    };
  }, [open]);

  // ── Outside click + Escape ─────────────────────────────────────────────────
  useEffect(() => {
    if (!state) return;
    const onPointer = (e: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.stopPropagation(); close(); }
    };
    document.addEventListener('pointerdown', onPointer, true);
    document.addEventListener('keydown',     onKey,     true);
    return () => {
      document.removeEventListener('pointerdown', onPointer, true);
      document.removeEventListener('keydown',     onKey,     true);
    };
  }, [state, close]);

  // ── Option select ──────────────────────────────────────────────────────────
  const handleSelect = (opt: CtxOpt) => {
    if (opt.disabled || !state) return;
    onSelect?.(state.area, state.id, opt.id);
    close();
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  if (!state) return null;

  return (
    <div
      ref={menuRef}
      className="ctx-menu"
      style={{ left: state.left, top: state.top }}
      role="menu"
      aria-label={`${state.area} options`}
      onContextMenu={(e) => e.preventDefault()}
    >
      <ul className="ctx-list">
        {state.options.map((opt) => {
          const cls = [
            'ctx-opt',
            opt.danger   ? 'ctx-opt--danger'   : '',
            opt.disabled ? 'ctx-opt--disabled'  : '',
          ].filter(Boolean).join(' ');

          return (
            <Fragment key={opt.id}>
              {opt.separator && <li className="ctx-sep" role="separator" aria-hidden />}
              <li
                className={cls}
                role="menuitem"
                aria-disabled={opt.disabled ?? false}
                tabIndex={opt.disabled ? -1 : 0}
                onClick={() => handleSelect(opt)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSelect(opt); }}
              >
                <svg
                  className="ctx-opt__icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  {opt.icon.map((d, i) => (
                    <path key={i} d={d} stroke="currentColor" strokeWidth="1.5" />
                  ))}
                </svg>
                <span className="ctx-opt__label ff-s">{opt.label}</span>
              </li>
            </Fragment>
          );
        })}
      </ul>
    </div>
  );
}
