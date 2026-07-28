import type { CtxOpt } from './contextMenuConfig';

export const MENU_W        = 200;
export const OPT_H         = 34;
export const SEP_H         = 7;
export const PADDING_V     = 5;
export const CURSOR_OFFSET = 10;
export const LONG_PRESS_MS = 500;
export const SUB_DELAY_MS  = 120;

const MARGIN = 8;
const GAP    = 4;

export function calcPos(x: number, y: number, opts: CtxOpt[]) {
  const sepCount = opts.filter(o => o.separator).length;
  const menuH    = opts.length * OPT_H + sepCount * SEP_H + PADDING_V * 2;
  const vpW      = window.innerWidth;
  const vpH      = window.innerHeight;
  const rawLeft  = x + MENU_W + CURSOR_OFFSET > vpW
    ? x - MENU_W - CURSOR_OFFSET : x + CURSOR_OFFSET;
  const rawTop   = y + menuH + CURSOR_OFFSET > vpH
    ? y - menuH - CURSOR_OFFSET : y + CURSOR_OFFSET;
  return {
    left: Math.max(MARGIN, Math.min(rawLeft, vpW - MENU_W - MARGIN)),
    top:  Math.max(MARGIN, Math.min(rawTop,  vpH - menuH  - MARGIN)),
  };
}

export function calcSubPos(rowEl: HTMLElement, children: CtxOpt[]): { left: number; top: number } {
  const sepCount = children.filter(o => o.separator).length;
  const subH     = children.length * OPT_H + sepCount * SEP_H + PADDING_V * 2;
  const rect     = rowEl.getBoundingClientRect();
  const vpW      = window.innerWidth;
  const vpH      = window.innerHeight;
  const left = rect.right + GAP + MENU_W > vpW
    ? rect.left - MENU_W - GAP
    : rect.right + GAP;
  const top = rect.top + subH > vpH
    ? Math.max(MARGIN, vpH - subH - MARGIN)
    : rect.top;
  return { left, top };
}
