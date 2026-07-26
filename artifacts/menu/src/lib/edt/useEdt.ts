import { useState, useEffect } from 'react';
import { getActive } from './edtStore';

/** Returns true when the given id is the currently active edit target. */
export function useEdt(id: string) {
  const [isActive, setIsActive] = useState(() => getActive().activeId === id);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ id: string } | null>).detail;
      setIsActive(detail?.id === id);
    };
    document.addEventListener('edt:change', handler);
    return () => document.removeEventListener('edt:change', handler);
  }, [id]);

  return isActive;
}
