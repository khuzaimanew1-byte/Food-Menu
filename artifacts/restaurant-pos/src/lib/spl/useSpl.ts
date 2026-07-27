/**
 * useSpl — React hook for the split logic
 * ─────────────────────────────────────────────────────────────────────────
 * Attaches the split logic to a React element ref. When `dir` changes the
 * split is recalculated; when `dir` is null the split is cleared.
 * The hook returns the current SplEntry so consumers can react to which
 * children ended up in start vs. end.
 *
 * Usage:
 *   const { ref, entry } = useSpl('v');
 *   return <div ref={ref as React.RefObject<HTMLDivElement>}>…</div>;
 *
 *   // entry.start — children in the top / left zone
 *   // entry.end   — children in the bottom / right zone
 * ─────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useRef, useState } from 'react';
import { split, unsplit, type SplDir, type SplEntry } from './spl';

export function useSpl(dir: SplDir | null, at?: number) {
  const ref             = useRef<HTMLElement | null>(null);
  const [entry, setEntry] = useState<SplEntry | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (dir) {
      const e = split(el, dir, at);
      setEntry({ ...e }); // shallow copy so React sees the state change
    } else {
      unsplit(el);
      setEntry(null);
    }

    return () => {
      unsplit(el);
      setEntry(null);
    };
  // at intentionally included — re-split when the boundary moves
  }, [dir, at]);

  return { ref, entry };
}
