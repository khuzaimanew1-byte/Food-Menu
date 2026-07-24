import { useRef, useState, useCallback, useEffect, useId } from 'react';
import { valid, ACPT, MXSZ, type UpldSt, type UpldErr } from './upld';
import { bindDz } from './dropReg';
import type { ChangeEventHandler } from 'react';

interface Opts {
  onFile: (file: File) => void;
  acpt?: string;
  mxsz?: number;
}

export interface UseUpldR {
  dropId: string;
  state:  UpldSt;
  error:  UpldErr | null;
  pick:   () => void;
  inRef:  React.RefObject<HTMLInputElement | null>;
  isOn:   boolean;
  hovOn:  () => void;
  hovOff: () => void;
  onInp:  ChangeEventHandler<HTMLInputElement>;
}

export function useUpld({ onFile, acpt = ACPT, mxsz = MXSZ }: Opts): UseUpldR {
  const rawId  = useId();
  const dropId = rawId.replace(/:/g, '');
  const inRef  = useRef<HTMLInputElement>(null);

  const [state, setState] = useState<UpldSt>('idle');
  const [error, setError] = useState<UpldErr | null>(null);
  const [isDrg, setIsDrg] = useState(false);
  const [isHov, setIsHov] = useState(false);

  const proc = useCallback((file: File) => {
    const err = valid(file, acpt, mxsz);
    if (err) { setError(err); setState('err'); return; }
    setError(null);
    setState('load');
    onFile(file);
    setState('ok');
  }, [onFile, acpt, mxsz]);

  const onInp: ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    const f = e.target.files?.[0];
    if (f) proc(f);
    e.target.value = '';
  }, [proc]);

  useEffect(() => bindDz(dropId, {
    onFile:  (f) => proc(f[0]),
    onEnter: () => setIsDrg(true),
    onLeave: () => setIsDrg(false),
  }), [dropId, proc]);

  const pick   = useCallback(() => inRef.current?.click(), []);
  const hovOn  = useCallback(() => setIsHov(true),  []);
  const hovOff = useCallback(() => setIsHov(false), []);

  return { dropId, state, error, pick, inRef, isOn: isDrg || isHov, hovOn, hovOff, onInp };
}
