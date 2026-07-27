// ── MvLabel — Before / After tooltip tied to context-menu lifecycle ────────
// Appears near the right-click position while the context menu is open during
// a move operation. Hidden as soon as the menu closes or move mode ends.
// Trigger: ctx:mv-open (dispatched by ContextMenu) / ctx:mv-close / mv:change.

import { useState, useEffect } from 'react';
import './MvLabel.css';

interface LabelState {
  x:    number;
  y:    number;
  text: 'Before' | 'After';
}

type CtxMvOpenDetail = { x: number; y: number; text: 'Before' | 'After' };

export function MvLabel() {
  const [label, setLabel] = useState<LabelState | null>(null);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const { x, y, text } = (e as CustomEvent<CtxMvOpenDetail>).detail;
      setLabel({ x, y, text });
    };

    const onClose = () => setLabel(null);

    // Also clear when move mode deactivates entirely (e.g. Escape or paste)
    const onMvChange = (e: Event) => {
      const detail = (e as CustomEvent<unknown>).detail;
      if (!detail) setLabel(null);
    };

    document.addEventListener('ctx:mv-open',  onOpen);
    document.addEventListener('ctx:mv-close', onClose);
    document.addEventListener('mv:change',    onMvChange);
    return () => {
      document.removeEventListener('ctx:mv-open',  onOpen);
      document.removeEventListener('ctx:mv-close', onClose);
      document.removeEventListener('mv:change',    onMvChange);
    };
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
