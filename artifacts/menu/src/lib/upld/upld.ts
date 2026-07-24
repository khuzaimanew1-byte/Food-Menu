// Pure upload constants, types, validation — no React

export const ACPT = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
] as const;

export const MXSZ = 5 * 1024 * 1024; // 5 MB

export type UpldSt = 'idle' | 'loading' | 'done' | 'error';

export type UpldErr = 'type' | 'size' | 'read';

export function valid(file: File): UpldErr | null {
  if (!(ACPT as readonly string[]).includes(file.type)) return 'type';
  if (file.size > MXSZ) return 'size';
  return null;
}
