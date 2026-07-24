import { useId, useRef, useState, useEffect, useCallback } from 'react';
import { dropReg } from './dropReg';
import { valid } from './upld';
import type { UpldErr } from './upld';

interface UseUpldOpts {
  onUpload?: (file: File) => void;
  onError?:  (err: UpldErr) => void;
}

export function useUpld({ onUpload, onError }: UseUpldOpts = {}) {
  // useId produces ":r0:" style strings — sanitize for querySelector
  const rawId  = useId();
  const dropId = rawId.replace(/[^a-zA-Z0-9-]/g, '_');

  const inRef = useRef<HTMLInputElement>(null);

  const [isHov, setIsHov] = useState(false);
  const [isDrg, setIsDrg] = useState(false);

  // Single class driver: hover OR drag-over
  const isOn = isHov || isDrg;

  const handleFile = useCallback(
    (file: File) => {
      const err = valid(file);
      if (err) { onError?.(err); return; }
      onUpload?.(file);
    },
    [onUpload, onError],
  );

  // Register / unregister drop zone
  useEffect(() => {
    dropReg.register(dropId, {
      onFile:  handleFile,
      onEnter: () => setIsDrg(true),
      onLeave: () => setIsDrg(false),
    });
    return () => dropReg.unregister(dropId);
  }, [dropId, handleFile]);

  const pick   = useCallback(() => inRef.current?.click(), []);
  const hovOn  = useCallback(() => setIsHov(true),  []);
  const hovOff = useCallback(() => setIsHov(false), []);

  const onInp = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
      e.target.value = ''; // reset so same file can be re-picked
    },
    [handleFile],
  );

  return { dropId, inRef, isOn, isHov, isDrg, pick, onInp, hovOn, hovOff };
}
