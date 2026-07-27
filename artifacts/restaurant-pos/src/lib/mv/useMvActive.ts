// ── useMvActive — reactive global move state ──────────────────────────────
// Returns whether ANY move is in progress and which type (item/section).
// Use this in drop-target components to show the split visual.

import { useState, useEffect } from 'react';
import { getMoving } from './mvStore';
import type { MvType } from './mvStore';

export interface MvActiveState {
  active:     boolean;
  movingId:   string | null;
  movingType: MvType | null;
}

export function useMvActive(): MvActiveState {
  const [state, setState] = useState<MvActiveState>(() => {
    const { movingId, movingType } = getMoving();
    return { active: !!movingId, movingId, movingType };
  });

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ id: string; type: MvType } | null>).detail;
      setState({
        active:     !!detail,
        movingId:   detail?.id   ?? null,
        movingType: detail?.type ?? null,
      });
    };
    document.addEventListener('mv:change', handler);
    return () => document.removeEventListener('mv:change', handler);
  }, []);

  return state;
}
