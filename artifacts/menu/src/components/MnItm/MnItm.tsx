import { useState, useEffect, useRef } from "react";
import { Avt } from "../avatar/Avt";
import type { MnItem } from "@/data/menu";
import { useUpld } from "@/lib/upld/useUpld";
import { useImgUpld } from "@/lib/upld/useImgUpld";
import { useEdt } from "@/lib/edt/useEdt";
import { setDirty } from "@/lib/edt/edtStore";
import "./MnItm.css";

interface MnItmPr extends MnItem {
  shape?: 'ic' | 'sq' | 'plq';
}

export function MnItm({
  id, name, description, price, image,
  shape = 'ic',
}: MnItmPr) {
  const [sel, setSel]               = useState(false);
  const [editedName, setEditedName] = useState<string | null>(null);
  const [editedDesc, setEditedDesc] = useState<string | null>(null);
  const isActive = useEdt(String(id));

  // Refs to the contentEditable DOM nodes — needed for DOM reset on discard.
  const nameRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);

  // Keep shadow refs so the reset effect can read current values without
  // being listed as a dependency (we only want to fire on isActive changes).
  const displayNameRef = useRef(editedName ?? name);
  const displayDescRef = useRef(editedDesc ?? description);
  displayNameRef.current = editedName ?? name;
  displayDescRef.current = editedDesc ?? description;

  // Reset selection when entering edit mode.
  useEffect(() => { if (isActive) setSel(false); }, [isActive]);

  // When edit mode exits (save OR discard), force the contentEditable DOM
  // back to the current React state value. React intentionally skips diffing
  // contentEditable content, so typed-but-discarded text would otherwise
  // persist in the DOM and get picked up by the next saveAndDeactivate().
  useEffect(() => {
    if (!isActive) {
      if (nameRef.current) nameRef.current.textContent = displayNameRef.current;
      if (descRef.current) descRef.current.textContent = displayDescRef.current;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  // Persist edited text on Save.
  useEffect(() => {
    const handler = (e: Event) => {
      const d = (e as CustomEvent<{ id: string; fields: Record<string, string> }>).detail;
      if (d?.id !== String(id)) return;
      if (d.fields['name'] !== undefined) setEditedName(d.fields['name']);
      if (d.fields['desc'] !== undefined) setEditedDesc(d.fields['desc']);
    };
    document.addEventListener('edt:save', handler);
    return () => document.removeEventListener('edt:save', handler);
  }, [id]);

  const displayName = editedName ?? name;
  const displayDesc = editedDesc ?? description;

  const { src: imgSrc, onUpload: rawUpload } = useImgUpld(image);
  // Wrap so an image swap also marks the edit as dirty — triggers confirmation
  // modal on deactivate just like text edits do.
  const handleUpload = (file: File) => { rawUpload(file); setDirty(true); };
  const upld = useUpld({ onUpload: handleUpload, enabled: isActive });

  return (
    <div
      className={`mic-wpr${sel ? " sel" : ""}${isActive ? " edt-on" : ""}`}
      data-area="item"
      data-id={id}
      data-drop-id={isActive ? upld.dropId : undefined}
      onClick={isActive ? undefined : () => setSel((s) => !s)}
    >
      <div className="mic">
        <div
          className="mic-avt"
          data-shape={shape}
          onClick={isActive ? (e) => e.stopPropagation() : undefined}
        >
          <Avt
            src={imgSrc} name={displayName} alt={displayName} shape={shape}
            uploadable={isActive}
            onUpload={isActive ? handleUpload : undefined}
            isDragging={isActive ? upld.isDrg : false}
          />

          {shape === 'ic' && (
            <div className="mic-chk" aria-hidden>
              <svg className="mic-mk" viewBox="0 0 24 24" fill="none" aria-hidden>
                <polyline points="20 6 9 17 4 12" stroke="currentColor"
                  strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          )}
        </div>

        <div className="mic-body">
          <div className="mic-row">
            <h3
              ref={nameRef}
              className="mic-name ff-s"
              data-edt-field={isActive ? "name" : undefined}
              contentEditable={isActive || undefined}
              suppressContentEditableWarning
            >
              {displayName}
            </h3>
            <div className="mic-lead" />
            <span className="mic-price ff-s">{price}</span>
          </div>
          <p
            ref={descRef}
            className="mic-desc ff-s"
            data-edt-field={isActive ? "desc" : undefined}
            contentEditable={isActive || undefined}
            suppressContentEditableWarning
          >
            {displayDesc}
          </p>
        </div>
      </div>
    </div>
  );
}
