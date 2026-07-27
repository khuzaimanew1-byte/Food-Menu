/**
 * spl — global split logic
 * ─────────────────────────────────────────────────────────────────────────
 * Divides any element into a two-part flow — START and END — without
 * inserting new nodes or altering the element's layout in any way.
 *
 * Direction (pick exactly one):
 *   'v'  vertical   — start = top  half, end = bottom half
 *   'h'  horizontal — start = left half, end = right  half
 *
 * Class-based activation (after initSpl()):
 *   .spl-v  → treated as vertical   split
 *   .spl-h  → treated as horizontal split
 *
 * How it works:
 *   The element's direct children are inspected at call-time using
 *   getBoundingClientRect(). Each child's center point is compared to
 *   the element's midpoint (or --spl-at, expressed as a 0–1 fraction
 *   or a percentage string on the element). Children whose center falls
 *   in the first zone get data-spl-part="start"; the rest get "end".
 *   No new elements are created. No flex/grid/position is touched.
 *
 * Exports:
 *   split(el, dir, at?)   — apply the split, returns SplEntry
 *   unsplit(el)           — clear the split (removes data attrs)
 *   getSplit(el)          — look up the current SplEntry for an element
 *   isSplit(el)           — whether the element is currently split
 *   initSpl(root?)        — start the MutationObserver (call once)
 *   destroySpl()          — stop observer + clear all splits
 * ─────────────────────────────────────────────────────────────────────────
 */

export type SplDir = 'v' | 'h';
export type SplPart = 'start' | 'end';

export interface SplEntry {
  /** The element that carries the split class. */
  el:    HTMLElement;
  /** Axis of the split. */
  dir:   SplDir;
  /** Direct children whose center falls in the first zone. */
  start: HTMLElement[];
  /** Direct children whose center falls in the second zone. */
  end:   HTMLElement[];
}

// ── Constants ──────────────────────────────────────────────────────────────

const CLS_V    = 'spl-v';
const CLS_H    = 'spl-h';
/** data-spl-part attribute written to each child. */
const DATA_KEY = 'splPart';   // → data-spl-part on the DOM node

// ── Registry — one entry per active split element ─────────────────────────

const registry = new Map<HTMLElement, SplEntry>();

// ── Helpers ────────────────────────────────────────────────────────────────

/**
 * Read --spl-at from the element's computed style.
 * Accepts percentages ("40%") or bare 0–1 fractions ("0.4").
 * Falls back to 0.5 when absent or unparseable.
 */
function readAt(el: HTMLElement): number {
  const raw = getComputedStyle(el).getPropertyValue('--spl-at').trim();
  if (!raw) return 0.5;
  if (raw.endsWith('%')) return parseFloat(raw) / 100;
  const n = parseFloat(raw);
  return Number.isFinite(n) ? n : 0.5;
}

/** Return the split direction from the element's class list, or null. */
function dirOf(el: HTMLElement): SplDir | null {
  if (el.classList.contains(CLS_V)) return 'v';
  if (el.classList.contains(CLS_H)) return 'h';
  return null;
}

// ── Core API ───────────────────────────────────────────────────────────────

/**
 * Split an element into start and end parts.
 *
 * Each direct child is tagged with data-spl-part="start" or "end"
 * based on whether its centre point falls before or after the
 * element's split boundary. No layout is modified.
 *
 * @param el   The element to split.
 * @param dir  'v' (top/bottom) or 'h' (left/right).
 * @param at   Optional override for the boundary fraction (0–1).
 *             Defaults to the --spl-at CSS custom property, or 0.5.
 */
export function split(el: HTMLElement, dir: SplDir, at?: number): SplEntry {
  const frac  = at ?? readAt(el);
  const rect   = el.getBoundingClientRect();

  // The boundary in viewport-px along the chosen axis
  const bound  = dir === 'v'
    ? rect.top  + rect.height * frac
    : rect.left + rect.width  * frac;

  const start: HTMLElement[] = [];
  const end:   HTMLElement[] = [];

  for (const child of Array.from(el.children) as HTMLElement[]) {
    const cr      = child.getBoundingClientRect();
    // Use the child's centre point to decide which zone it belongs to
    const centre  = dir === 'v'
      ? cr.top  + cr.height / 2
      : cr.left + cr.width  / 2;

    const part: SplPart = centre < bound ? 'start' : 'end';
    child.dataset[DATA_KEY] = part;    // data-spl-part="start"|"end"
    (part === 'start' ? start : end).push(child);
  }

  const entry: SplEntry = { el, dir, start, end };
  registry.set(el, entry);
  return entry;
}

/**
 * Remove the split from an element.
 * Clears data-spl-part from every direct child and removes the element
 * from the registry. Safe to call on an element that was never split.
 */
export function unsplit(el: HTMLElement): void {
  for (const child of Array.from(el.children) as HTMLElement[]) {
    delete child.dataset[DATA_KEY];
  }
  registry.delete(el);
}

/** Return the current SplEntry for an element, or undefined. */
export function getSplit(el: HTMLElement): SplEntry | undefined {
  return registry.get(el);
}

/** True when the element is currently registered as a split target. */
export function isSplit(el: HTMLElement): boolean {
  return registry.has(el);
}

/**
 * getPartAtPoint — geometry helper for the move/paste system.
 *
 * Returns which split zone a pointer coordinate falls in, WITHOUT
 * requiring the element to carry a split class. This is the single
 * call-site for the before/after insert decision in actions.ts; the
 * spatial formula is identical to the one inside split() so there is
 * no duplication of logic.
 *
 * @param el   Target element to measure against.
 * @param x    Pointer X in viewport px (from contextmenu / pointerdown).
 * @param y    Pointer Y in viewport px.
 * @param dir  Axis: 'v' top/bottom (default), 'h' left/right.
 * @param at   Split-point fraction 0–1. Falls back to --spl-at then 0.5.
 */
export function getPartAtPoint(
  el:  HTMLElement,
  x:   number,
  y:   number,
  dir: SplDir = 'v',
  at?: number,
): SplPart {
  const frac  = at ?? readAt(el);
  const rect   = el.getBoundingClientRect();
  const bound  = dir === 'v'
    ? rect.top  + rect.height * frac
    : rect.left + rect.width  * frac;
  const pos = dir === 'v' ? y : x;
  return pos < bound ? 'start' : 'end';
}

// ── Class-based activation via MutationObserver ───────────────────────────

let _observer: MutationObserver | null = null;

function handleEl(el: HTMLElement): void {
  const dir = dirOf(el);
  if (dir) {
    split(el, dir);
  } else if (isSplit(el)) {
    unsplit(el);
  }
}

/**
 * initSpl — call once (e.g. in main.tsx) to enable class-based activation.
 *
 * After this call, any element in `root` that gains the class .spl-v or
 * .spl-h is automatically split; removing the class clears the split.
 * Newly inserted elements with those classes are also processed.
 * Elements that already carry the class at call-time are processed immediately.
 *
 * @param root  Subtree to observe. Defaults to document.body.
 */
export function initSpl(root: Element = document.body): void {
  if (_observer) return; // idempotent — safe to call more than once

  _observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      // Class change on an existing element
      if (m.type === 'attributes' && m.attributeName === 'class') {
        handleEl(m.target as HTMLElement);
      }
      // Newly inserted elements
      if (m.type === 'childList') {
        m.addedNodes.forEach((n) => {
          if (n instanceof HTMLElement) handleEl(n);
        });
      }
    }
  });

  _observer.observe(root, {
    subtree:         true,
    attributes:      true,
    attributeFilter: ['class'],
    childList:       true,
  });

  // Bootstrap: process elements that already carry a split class
  root.querySelectorAll<HTMLElement>(`.${CLS_V}, .${CLS_H}`)
      .forEach(handleEl);
}

/**
 * destroySpl — stop the observer and clear every active split.
 * Useful in tests or hot-module-replacement teardown.
 */
export function destroySpl(): void {
  _observer?.disconnect();
  _observer = null;
  registry.forEach((_, el) => unsplit(el));
}
