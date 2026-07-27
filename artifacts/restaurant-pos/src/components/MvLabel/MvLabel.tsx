// ── MvLabel — floating Before / After cursor label ────────────────────────
// Appears near the cursor while a move is in progress and the pointer is
// over a valid drop target. No lines, no borders, no element changes.
// Removed automatically when move mode deactivates or pointer leaves target.

import { useState, useEffect, useRef } from 'react';
import { getMoving } from '@/lib/mv/mvStore';
import type { MvType } from '@/lib/mv/mvStore';
import './MvLabel.css';

interface LabelState {
  x:    number;
  y:    number;
  text: 'Before' | 'After';
}

export function MvLabel() {
  const [label, setLabel]   = useState<LabelState | null>(null);
  const mvRef = useRef<{ active: boolean; type: MvType | null }>({
    active: false,
    type:   null,
  });

  // Track move-mode on/off
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ id: string; type: MvType } | null>).detail;
      mvRef.current = { active: !!detail, type: detail?.type ?? null };
      if (!detail) setLabel(null);
    };
    document.addEventListener('mv:change', handler);
    return () => document.removeEventListener('mv:change', handler);
  }, []);

  // Track cursor position and resolve Before / After
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const { active, type } = mvRef.current;
      if (!active || !type) { setLabel(null); return; }

      const area = type === 'item' ? 'item' : 'section';
      const hit  = document.elementFromPoint(e.clientX, e.clientY);
      const target = hit?.closest<HTMLElement>(`[data-area="${area}"]`);
      if (!target) { setLabel(null); return; }

      // Don't label the source element itself
      const { movingId } = getMoving();
      if (target.dataset.id === movingId) { setLabel(null); return; }

      const rect = target.getBoundingClientRect();

      // Item → horizontal split (left = Before, right = After)
      // Section → vertical split  (top  = Before, bottom = After)
      const text: 'Before' | 'After' = type === 'item'
        ? (e.clientX < rect.left + rect.width  / 2 ? 'Before' : 'After')
        : (e.clientY < rect.top  + rect.height / 2 ? 'Before' : 'After');

      setLabel({ x: e.clientX, y: e.clientY, text });
    };

    document.addEventListener('mousemove', onMove);
    return () => document.removeEventListener('mousemove', onMove);
  }, []);

  if (!label) return null;

  return (
    <div
      className={`mv-lbl mv-lbl--${label.text === 'Before' ? 'before' : 'after'}`}
      style={{ left: label.x + 16, top: label.y - 28 }}
    >
      {label.text}
    </div>
  );
}
