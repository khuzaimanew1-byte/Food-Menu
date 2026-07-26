// Reusable hook: image src with committed/pending split so it participates
// in the edit save/discard lifecycle.
//
// committed = last saved src (what to revert to on Discard)
// pending   = what's shown right now (updated on upload)
//
// commit() — call on Save:    makes pending the new committed, retains blob URL
// revert() — call on Discard: revokes pending blob URL, restores committed src
//
// Both commit/revert are stable refs (empty useCallback deps) — safe to call
// from any stale closure without adding them to dependency arrays.
//
// Usage:
//   const img = useImgUpld(item.image);
//   <Avt src={img.src} uploadable onUpload={img.onUpload} />
//   // on save:    img.commit()
//   // on discard: img.revert()

import { useState, useRef, useEffect, useCallback } from 'react';

export function useImgUpld(initial?: string) {
  const [src, setSrc] = useState<string | undefined>(initial);

  // Refs keep commit/revert free of stale-closure issues — they always read
  // current values without needing to be in any dependency array.
  const committedRef   = useRef<string | undefined>(initial);
  const pendingBlobRef = useRef<string | null>(null); // blob URL awaiting commit

  // Revoke any uncommitted blob on unmount to prevent memory leaks.
  useEffect(() => () => {
    if (pendingBlobRef.current) URL.revokeObjectURL(pendingBlobRef.current);
  }, []);

  /** User picked/dropped a new image — create a blob URL and show it. */
  const onUpload = useCallback((file: File) => {
    if (pendingBlobRef.current) URL.revokeObjectURL(pendingBlobRef.current);
    const url = URL.createObjectURL(file);
    pendingBlobRef.current = url;
    setSrc(url);
  }, []);

  /** Save path — make pending the new committed value. */
  const commit = useCallback(() => {
    if (pendingBlobRef.current !== null) {
      // Promote blob to committed; clear pending so it isn't revoked on revert/unmount.
      committedRef.current   = pendingBlobRef.current;
      pendingBlobRef.current = null;
    }
    // No upload this session → committedRef unchanged, nothing to do.
  }, []);

  /** Discard path — revoke the pending blob and restore the committed src. */
  const revert = useCallback(() => {
    if (pendingBlobRef.current) {
      URL.revokeObjectURL(pendingBlobRef.current);
      pendingBlobRef.current = null;
    }
    setSrc(committedRef.current);
  }, []);

  return { src, onUpload, commit, revert };
}
