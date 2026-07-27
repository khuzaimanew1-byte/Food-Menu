// ── useMvActive — reactive global move state ──────────────────────────────
// Two hooks: one for item-move state, one for section-move state.
// Use in drop-target components to know when to show the copy cursor.

import { useState, useEffect } from 'react';
import { getMovingItem, getMovingSect } from './mvStore';

export interface MvActiveState {
  active:   boolean;
  movingId: string | null;
}

/** Returns whether any item is currently in move mode. */
export function useMvItemActive(): MvActiveState {
  const [state, setState] = useState<MvActiveState>(() => {
    const { movingId } = getMovingItem();
    return { active: !!movingId, movingId };
  });

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ id: string } | null>).detail;
      setState({ active: !!detail, movingId: detail?.id ?? null });
    };
    document.addEventListener('mv:item:change', handler);
    return () => document.removeEventListener('mv:item:change', handler);
  }, []);

  return state;
}

/** Returns whether any section is currently in move mode. */
export function useMvSectActive(): MvActiveState {
  const [state, setState] = useState<MvActiveState>(() => {
    const { movingId } = getMovingSect();
    return { active: !!movingId, movingId };
  });

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ id: string } | null>).detail;
      setState({ active: !!detail, movingId: detail?.id ?? null });
    };
    document.addEventListener('mv:sect:change', handler);
    return () => document.removeEventListener('mv:sect:change', handler);
  }, []);

  return state;
}
