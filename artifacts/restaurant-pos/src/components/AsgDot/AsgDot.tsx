// ── AsgDot — reusable assignment status dot indicator ─────────────────────
// Renders only when the item has an assign record in the store.
// Position: absolute — parent must be position:relative (mic-avt-wrap).

import { useState, useEffect } from 'react';
import { hasAssign }           from '@/lib/asg/assignStore';
import './AsgDot.css';

interface AsgDotPr {
  itemId: string;
}

export function AsgDot({ itemId }: AsgDotPr) {
  const [show, setShow] = useState(() => hasAssign(itemId));

  useEffect(() => {
    const sync = () => setShow(hasAssign(itemId));
    document.addEventListener('assign:change', sync);
    return () => document.removeEventListener('assign:change', sync);
  }, [itemId]);

  if (!show) return null;
  return <span className="asg-dot" aria-hidden />;
}
