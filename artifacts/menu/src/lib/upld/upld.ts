// Pure upload constants, types, validation — no React.
// Also hosts the shared object-URL store used by upldStore + dropReg.

export const ACPT = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
] as const;

export type UpldSt  = 'idle' | 'loading' | 'done' | 'error';
export type UpldErr = 'type' | 'read';

export function valid(file: File): UpldErr | null {
  if (!(ACPT as readonly string[]).includes(file.type)) return 'type';
  return null;
}

// ── Shared object-URL store ────────────────────────────────────────────────
// One global Map<id, objectURL>; revoked on each new upload and on unload.
const objUrls = new Map<string, string>();

/** Validate file, revoke previous object URL for id, create new one,
 *  then querySelector img[data-img-id="${id}"] and set its src directly.
 *  Query is deferred to call-time so a fresh DOM element is always targeted. */
export function setImgSrc(id: string, file: File): void {
  if (valid(file)) return; // invalid type — silent skip
  const prev = objUrls.get(id);
  if (prev) URL.revokeObjectURL(prev);
  const url = URL.createObjectURL(file);
  objUrls.set(id, url);
  const img = document.querySelector<HTMLImageElement>(`img[data-img-id="${id}"]`);
  if (img) img.src = url;
}

/** Revoke all stored object URLs — registered on beforeunload. */
export function revokeAll(): void {
  for (const url of objUrls.values()) URL.revokeObjectURL(url);
  objUrls.clear();
}

/** Get stored object URL for id — used by MnItm to restore src on remount. */
export function getObjUrl(id: string): string | undefined {
  return objUrls.get(id);
}

/** Re-apply the stored URL (if any) to img[data-img-id="${id}"] in the DOM.
 *  Call from useEffect after mount to restore images after page flip. */
export function restoreImgSrc(id: string): void {
  const url = objUrls.get(id);
  if (!url) return;
  const img = document.querySelector<HTMLImageElement>(`img[data-img-id="${id}"]`);
  if (img) img.src = url;
}
