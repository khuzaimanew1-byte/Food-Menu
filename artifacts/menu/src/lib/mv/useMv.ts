// ── useMv — React hook for move state ────────────────────────────────────
// Mirrors useEdt.ts exactly. Subscribes to the mv:change event and returns
// whether the given id is the currently moving item/section.

import { useState, useEffect } from 'react';
import { getMoving } from './mvStore';

/** Returns true when the given id is the currently active move source. */
export function useMv(id: string): boolean {
  const [isMoving, setIsMoving] = useState(() => getMoving().movingId === id);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ id: string } | null>).detail;
      setIsMoving(detail?.id === id);
    };
    document.addEventListener('mv:change', handler);
    return () => document.removeEventListener('mv:change', handler);
  }, [id]);

  return isMoving;
}
