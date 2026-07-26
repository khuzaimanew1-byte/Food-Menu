import { useId, useState, useEffect, useCallback } from 'react';
import { dropReg  } from './dropReg';
import { upldStore } from './upldStore';
import { valid } from './upld';
import type { UpldErr } from './upld';

interface UseUpldOpts {
  onUpload?: (file: File) => void;
  onError?:  (err: UpldErr) => void;
  /** When false neither store is registered and all state stays idle.
   *  Pass !!uploadable so non-uploadable instances create no dead entries. */
  enabled?:  boolean;
}

export function useUpld({ onUpload, onError, enabled = true }: UseUpldOpts = {}) {
  // useId produces ":r0:" style strings — sanitize for querySelector / map key
  const rawId  = useId();
  const dropId = rawId.replace(/[^a-zA-Z0-9-]/g, '_');

  const [isHov, setIsHov] = useState(false);
  const [isDrg, setIsDrg] = useState(false);
  const isOn = isHov || isDrg;

  const handleFile = useCallback(
    (file: File) => {
      const err = valid(file);
      if (err) { onError?.(err); return; }
      onUpload?.(file);
    },
    [onUpload, onError],
  );

  // ── Global pick store (click / tap path) ────────────────────────────────
  useEffect(() => {
    if (!enabled) return;
    upldStore.register(dropId, handleFile);
    return () => upldStore.unregister(dropId);
  }, [dropId, handleFile, enabled]);

  // ── Global drag-drop store ───────────────────────────────────────────────
  useEffect(() => {
    if (!enabled) return;
    dropReg.register(dropId, {
      onFile:  handleFile,
      onEnter: () => setIsDrg(true),
      onLeave: () => setIsDrg(false),
    });
    return () => dropReg.unregister(dropId);
  }, [dropId, handleFile, enabled]);

  const pick   = useCallback(() => { if (enabled) upldStore.pick(dropId); }, [dropId, enabled]);
  const hovOn  = useCallback(() => { if (enabled) setIsHov(true);  }, [enabled]);
  const hovOff = useCallback(() => { if (enabled) setIsHov(false); }, [enabled]);

  // No inRef / onInp — file input lives in upldStore, not in the component.
  return { dropId, isOn, isHov, isDrg, pick, hovOn, hovOff };
}
