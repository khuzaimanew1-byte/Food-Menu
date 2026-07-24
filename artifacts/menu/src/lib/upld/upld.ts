export const ACPT = 'image/jpeg,image/png,image/webp';
export const MXSZ = 5 * 1024 * 1024;

export type UpldSt = 'idle' | 'load' | 'ok' | 'err';

export interface UpldErr { kind: 'type' | 'size'; msg: string; }

export function valid(file: File, acpt = ACPT, mxsz = MXSZ): UpldErr | null {
  if (!acpt.split(',').map(t => t.trim()).includes(file.type))
    return { kind: 'type', msg: 'Invalid type' };
  if (file.size > mxsz)
    return { kind: 'size', msg: 'Too large' };
  return null;
}
