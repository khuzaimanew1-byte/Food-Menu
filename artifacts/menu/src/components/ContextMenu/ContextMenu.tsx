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

interface SubState {
  optId:  string;
  left:   number;
  top:    number;
  items:  CtxOpt[];
}

interface CtxMenuPr {
  onSelect?: (area: CtxArea, id: string | null, optId: string) => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const LONG_PRESS_MS  = 500;
const MENU_W         = 200;
const OPT_H          = 34;
const SEP_H          = 7;
const PADDING_V      = 5;
const CURSOR_OFFSET  = 10;
const SUB_DELAY_MS   = 120;   // hover delay before submenu opens

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

function calcSubPos(rowEl: HTMLElement, children: CtxOpt[]): { left: number; top: number } {
  const sepCount = children.filter(o => o.separator).length;
  const subH     = children.length * OPT_H + sepCount * SEP_H + PADDING_V * 2;
  const rect     = rowEl.getBoundingClientRect();
  const vpW      = window.innerWidth;
  const vpH      = window.innerHeight;
  const MARGIN   = 8;
  const GAP      = 4;

  const left = rect.right + GAP + MENU_W > vpW
    ? rect.left - MENU_W - GAP
    : rect.right + GAP;

  const top = rect.top + subH > vpH
    ? Math.max(MARGIN, vpH - subH - MARGIN)
    : rect.top;

  return { left, top };
}

// ─── Option row (shared between main menu and submenu) ────────────────────────

interface OptRowPr {
  opt:         CtxOpt;
  onSelect:    (opt: CtxOpt) => void;
  onSubEnter?: (opt: CtxOpt, el: HTMLElement) => void;
  onSubLeave?: () => void;
  active?:     boolean;
}

function OptRow({ opt, onSelect, onSubEnter, onSubLeave, active }: OptRowPr) {
  const ref = useRef<HTMLLIElement>(null);
  const cls = [
    'ctx-opt',
    opt.children  ? 'ctx-opt--sub'      : '',
    opt.danger    ? 'ctx-opt--danger'    : '',
    opt.disabled  ? 'ctx-opt--disabled'  : '',
    active        ? 'ctx-opt--sub-open'  : '',
  ].filter(Boolean).join(' ');

  return (
    <Fragment>
      {opt.separator && <li className="ctx-sep" role="separator" aria-hidden />}
      <li
        ref={ref}
        className={cls}
        role={opt.children ? 'menuitem' : 'menuitem'}
        aria-haspopup={opt.children ? true : undefined}
        aria-expanded={opt.children ? active : undefined}
        aria-disabled={opt.disabled ?? false}
        tabIndex={opt.disabled ? -1 : 0}
        onClick={() => { if (!opt.children) onSelect(opt); }}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !opt.children) onSelect(opt);
        }}
        onMouseEnter={() => {
          if (opt.children && ref.current && onSubEnter) onSubEnter(opt, ref.current);
          else if (onSubLeave) onSubLeave(); // hovering non-sub row closes any open sub
        }}
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
        {opt.children && (
          <svg className="ctx-opt__chevron" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </li>
    </Fragment>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ContextMenu({ onSelect }: CtxMenuPr) {
  const [state,    setState]    = useState<MenuState | null>(null);
  const [subState, setSubState] = useState<SubState  | null>(null);

  const menuRef     = useRef<HTMLDivElement>(null);
  const subMenuRef  = useRef<HTMLDivElement>(null);
  const activeElRef = useRef<HTMLElement | null>(null);
  const lpTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lpOriginRef = useRef({ x: 0, y: 0 });
  const subTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    setSubState(null);
    setState({ ...calcPos(x, y, options), area, id, options });
  }, [setActive]);

  // ── Close ──────────────────────────────────────────────────────────────────
  const close = useCallback(() => {
    setActive(null);
    setState(null);
    setSubState(null);
  }, [setActive]);

  // ── Submenu open/close ─────────────────────────────────────────────────────
  const openSub = useCallback((opt: CtxOpt, rowEl: HTMLElement) => {
    if (subTimerRef.current) clearTimeout(subTimerRef.current);
    subTimerRef.current = setTimeout(() => {
      if (!opt.children) return;
      const pos = calcSubPos(rowEl, opt.children);
      setSubState({ optId: opt.id, left: pos.left, top: pos.top, items: opt.children });
    }, SUB_DELAY_MS);
  }, []);

  const closeSub = useCallback(() => {
    if (subTimerRef.current) clearTimeout(subTimerRef.current);
    subTimerRef.current = setTimeout(() => setSubState(null), SUB_DELAY_MS);
  }, []);

  const keepSub = useCallback(() => {
    if (subTimerRef.current) clearTimeout(subTimerRef.current);
  }, []);

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
      const inMain = menuRef.current?.contains(e.target as Node);
      const inSub  = subMenuRef.current?.contains(e.target as Node);
      if (!inMain && !inSub) close();
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
    <>
      {/* Main menu */}
      <div
        ref={menuRef}
        className="ctx-menu"
        style={{ left: state.left, top: state.top }}
        role="menu"
        aria-label={`${state.area} options`}
        onContextMenu={(e) => e.preventDefault()}
      >
        <ul className="ctx-list">
          {state.options.map((opt) => (
            <OptRow
              key={opt.id}
              opt={opt}
              onSelect={handleSelect}
              onSubEnter={openSub}
              onSubLeave={closeSub}
              active={subState?.optId === opt.id}
            />
          ))}
        </ul>
      </div>

      {/* Submenu flyout */}
      {subState && (
        <div
          ref={subMenuRef}
          className="ctx-menu ctx-submenu"
          style={{ left: subState.left, top: subState.top }}
          role="menu"
          onContextMenu={(e) => e.preventDefault()}
          onMouseEnter={keepSub}
          onMouseLeave={closeSub}
        >
          <ul className="ctx-list">
            {subState.items.map((opt) => (
              <OptRow
                key={opt.id}
                opt={opt}
                onSelect={handleSelect}
              />
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
