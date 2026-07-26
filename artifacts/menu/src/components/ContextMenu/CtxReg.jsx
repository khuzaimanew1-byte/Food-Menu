/**
 * CtxReg — Context Menu Registry
 *
 * Zero DOM attribute approach.
 * Components register themselves via useCtxTrg(); the context menu
 * finds area + id by walking the DOM and looking up in a WeakMap.
 *
 * Exports:
 *   CtxPrv       — wrap your app once (e.g. in App.tsx)
 *   useCtxTrg    — used inside target components (MnItm, MnHdg, MnBrd…)
 *   useCtxReg    — used inside ContextMenu to call find()
 */

import { createContext, useContext, useRef, useCallback } from 'react';

const CtxCtx = createContext(null);

// ── Provider ──────────────────────────────────────────────────────────────────
export function CtxPrv({ children }) {
  // Stable API object — never recreated, so Provider value never changes.
  const api = useRef({
    _map: new Map(),
    set(el, area, id)  { this._map.set(el, { area, id }); },
    del(el)            { this._map.delete(el); },
    /** Walk up from `target` and return the first registered ancestor. */
    find(target) {
      let el = target;
      while (el && el !== document.body) {
        if (this._map.has(el)) return { ...this._map.get(el), el };
        el = el.parentElement;
      }
      return null;
    },
  }).current;

  return <CtxCtx.Provider value={api}>{children}</CtxCtx.Provider>;
}

// ── Hook for target components ────────────────────────────────────────────────
/**
 * Returns a callback ref. Attach it to the element's `ref` prop.
 * The element is registered/unregistered automatically on mount/unmount.
 * Re-registration happens automatically when `area` or `id` change.
 *
 * Usage:
 *   const ref = useCtxTrg('item', id);
 *   return <div ref={ref} …>
 */
export function useCtxTrg(area, id) {
  const api    = useContext(CtxCtx);
  const prevEl = useRef(null);

  return useCallback((el) => {
    // Clean up previous element (handles unmount and id/area changes)
    if (prevEl.current) api?.del(prevEl.current);
    prevEl.current = el;
    if (el) api?.set(el, area, id);
  }, [api, area, id]);   // new callback → React re-calls ref on id/area change
}

// ── Hook for ContextMenu ──────────────────────────────────────────────────────
/** Returns the registry API so ContextMenu can call api.find(target). */
export function useCtxReg() {
  return useContext(CtxCtx);
}
