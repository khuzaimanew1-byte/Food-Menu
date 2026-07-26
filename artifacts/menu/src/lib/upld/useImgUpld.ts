// Reusable hook: manages an image src backed by an object URL.
// Automatically revokes the previous URL before creating a new one so
// there are no memory leaks across repeated uploads.
//
// Usage:
//   const { src, onUpload } = useImgUpld(item.image);
//   <Avt src={src} uploadable onUpload={onUpload} />

import { useState, useRef, useEffect } from 'react';

export function useImgUpld(initial?: string) {
  const [src, setSrc] = useState<string | undefined>(initial);
  const objUrlRef = useRef<string | null>(null);

  // Revoke on unmount so object URLs don't linger after the component leaves
  useEffect(() => {
    return () => { if (objUrlRef.current) URL.revokeObjectURL(objUrlRef.current); };
  }, []);

  const onUpload = (file: File) => {
    if (objUrlRef.current) URL.revokeObjectURL(objUrlRef.current);
    const url = URL.createObjectURL(file);
    objUrlRef.current = url;
    setSrc(url);
  };

  return { src, onUpload };
}
