import { useState, useEffect } from 'react';
import { isActiveId } from './edtStore';

/** Returns true when the given id is currently active in the edit store. */
export function useEdt(id: string) {
  const [isActive, setIsActive] = useState(() => isActiveId(id));

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ active: Array<{ id: string }> }>).detail;
      setIsActive(detail?.active?.some(a => a.id === id) ?? false);
    };
    document.addEventListener('edt:change', handler);
    return () => document.removeEventListener('edt:change', handler);
  }, [id]);

  return isActive;
}
