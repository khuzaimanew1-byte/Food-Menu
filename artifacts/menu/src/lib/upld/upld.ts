// Pure upload constants, types, validation — no React

export const ACPT = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
] as const;

export type UpldSt = 'idle' | 'loading' | 'done' | 'error';

export type UpldErr = 'type' | 'read';

export function valid(file: File): UpldErr | null {
  if (!(ACPT as readonly string[]).includes(file.type)) return 'type';
  return null;
}
