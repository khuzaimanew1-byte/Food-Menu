// ── useMv — React hooks for item and section move state ───────────────────
// Two separate hooks: useMvItem subscribes to item moves,
// useMvSect subscribes to section moves. Each listens to its own event.

import { useState, useEffect } from 'react';
import { getMovingItem, getMovingSect } from './mvStore';

/** Returns true when this item id is the currently active item-move source. */
export function useMvItem(id: string): boolean {
  const [isMoving, setIsMoving] = useState(() => getMovingItem().movingId === id);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ id: string } | null>).detail;
      setIsMoving(detail?.id === id);
    };
    document.addEventListener('mv:item:change', handler);
    return () => document.removeEventListener('mv:item:change', handler);
  }, [id]);

  return isMoving;
}

/** Returns true when this section id is the currently active section-move source. */
export function useMvSect(id: string): boolean {
  const [isMoving, setIsMoving] = useState(() => getMovingSect().movingId === id);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ id: string } | null>).detail;
      setIsMoving(detail?.id === id);
    };
    document.addEventListener('mv:sect:change', handler);
    return () => document.removeEventListener('mv:sect:change', handler);
  }, [id]);

  return isMoving;
}
