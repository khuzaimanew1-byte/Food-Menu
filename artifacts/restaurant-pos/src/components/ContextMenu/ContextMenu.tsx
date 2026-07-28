import { useState, useEffect, useRef, useCallback } from 'react';
import { ICONS, MENU_CONFIG, detectArea } from './contextMenuConfig';
import type { CtxArea, CtxOpt } from './contextMenuConfig';
import { getMoving } from '@/lib/mv/mvStore';
import { resolveHint } from '@/lib/spl/splHint';
import { DropdownPanel } from '../DropdownPanel/DropdownPanel';
import type { SubState } from '../DropdownPanel/DropdownPanel';

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
const MENU_W         = 200;
const OPT_H          = 34;
const SEP_H          = 7;
const PADDING_V      = 5;
const CURSOR_OFFSET  = 10;
const SUB_DELAY_MS   = 120;

// ─── Position helpers ─────────────────────────────────────────────────────────

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

// ─── ContextMenu — trigger + state controller ─────────────────────────────────

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
    let options = MENU_CONFIG[area];
    if (!options?.length) return;

    const { movingId, movingType } = getMoving();
    if (movingId) {
      if (id && movingId === id) {
        options = [{ id: 'cancel-move', label: 'Cancel Move', icon: ICONS.cancelMove }];
      } else {
        options = options.map(opt => {
          if (opt.id !== 'move-item' && opt.id !== 'move-section') return opt;
          if ((opt.id === 'move-section' && movingType === 'item') ||
              (opt.id === 'move-item'    && movingType === 'section')) {
            return { ...opt, disabled: true };
          }
          const pasteLabel = opt.id === 'move-item' ? 'Paste Item' : 'Paste Section';
          if (!id) return { ...opt, label: pasteLabel };
          const rawEl = document.querySelector<HTMLElement>(
            `[data-area="${area}"][data-id="${CSS.escape(id)}"]`,
          );
          if (!rawEl) return { ...opt, label: pasteLabel };
          const hint = resolveHint(area, rawEl, x, y, movingType);
          if (!hint) return { ...opt, label: pasteLabel };
          return { ...opt, label: pasteLabel, hint: hint.part === 'start' ? 'before' : 'after' };
        });
      }
    }

    // ── Second pass: add-item / add-section hints ───────────────────────
    // Always shown (move mode or not). add-item on item → horizontal split.
    // add-section on item/section → vertical split (item auto-promotes to section).
    // add-item on section → append-only, no split hint.
    // add-section on page  → append-only, no split hint.
    if (id) {
      options = options.map(opt => {
        if (opt.id === 'add-item' && area === 'item') {
          const rawEl = document.querySelector<HTMLElement>(
            `[data-area="item"][data-id="${CSS.escape(id)}"]`,
          );
          if (!rawEl) return opt;
          const hint = resolveHint(area, rawEl, x, y, 'item');
          if (!hint) return opt;
          return { ...opt, hint: hint.part === 'start' ? 'before' : 'after' };
        }
        if (opt.id === 'add-section' && (area === 'item' || area === 'section')) {
          const rawEl = document.querySelector<HTMLElement>(
            `[data-area="${area}"][data-id="${CSS.escape(id)}"]`,
          );
          if (!rawEl) return opt;
          const hint = resolveHint(area, rawEl, x, y, 'section');
          if (!hint) return opt;
          return { ...opt, hint: hint.part === 'start' ? 'before' : 'after' };
        }
        return opt;
      });
    }

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
  const handleSelect = useCallback((opt: CtxOpt) => {
    if (opt.disabled || !state) return;
    onSelect?.(state.area, state.id, opt.id);
    close();
  }, [state, onSelect, close]);

  // ── Render ─────────────────────────────────────────────────────────────────
  if (!state) return null;

  return (
    <DropdownPanel
      left={state.left}
      top={state.top}
      ariaLabel={`${state.area} options`}
      options={state.options}
      onSelect={handleSelect}
      onSubEnter={openSub}
      onSubLeave={closeSub}
      subState={subState}
      onSubKeep={keepSub}
      menuRef={menuRef}
      subMenuRef={subMenuRef}
    />
  );
}
