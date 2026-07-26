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

  // Image upload — commit/revert integrated into the edit lifecycle below.
  const img  = useImgUpld(image);
  const upld = useUpld({ onUpload: (f) => { img.onUpload(f); setDirty(true); }, enabled: isActive });

  // Refs to contentEditable nodes for DOM reset on exit.
  const nameRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);

  // Shadow refs — always hold the latest display values so the exit effect
  // can read them without needing them as deps (fires only on isActive change).
  const displayNameRef = useRef(editedName ?? name);
  const displayDescRef = useRef(editedDesc ?? description);
  displayNameRef.current = editedName ?? name;
  displayDescRef.current = editedDesc ?? description;

  // didSaveRef: set true by the edt:save listener so the exit effect knows
  // whether this deactivation is a Save or a Discard.
  const didSaveRef = useRef(false);

  // Reset selection when entering edit mode.
  useEffect(() => { if (isActive) setSel(false); }, [isActive]);

  // ── edt:save — persist text fields and mark this exit as a Save ──────────
  useEffect(() => {
    const handler = (e: Event) => {
      const d = (e as CustomEvent<{ id: string; fields: Record<string, string> }>).detail;
      if (d?.id !== String(id)) return;
      if (d.fields['name'] !== undefined) setEditedName(d.fields['name']);
      if (d.fields['desc'] !== undefined) setEditedDesc(d.fields['desc']);
      didSaveRef.current = true; // next isActive→false is a Save, not a Discard
    };
    document.addEventListener('edt:save', handler);
    return () => document.removeEventListener('edt:save', handler);
  }, [id]);

  // ── Unified edit-exit effect ──────────────────────────────────────────────
  // Fires whenever isActive transitions true→false (Save OR Discard).
  // Handles both text (DOM reset) and image (commit/revert) in one place so
  // upload is always part of the edit lifecycle — never a separate concern.
  useEffect(() => {
    if (!isActive) {
      if (didSaveRef.current) {
        img.commit();   // Save: make the pending upload permanent
      } else {
        img.revert();   // Discard: revoke blob URL, restore committed image
      }
      didSaveRef.current = false;

      // contentEditable DOM reset: React doesn't diff these, so typed-but-
      // discarded text would persist without this explicit reset.
      if (nameRef.current) nameRef.current.textContent = displayNameRef.current;
      if (descRef.current) descRef.current.textContent = displayDescRef.current;
    }
    // img.commit and img.revert are stable (useCallback with no deps) — safe in deps.
  }, [isActive, img.commit, img.revert]);

  const displayName = editedName ?? name;
  const displayDesc = editedDesc ?? description;

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
            src={img.src} name={displayName} alt={displayName} shape={shape}
            uploadable={isActive}
            onUpload={isActive ? (f) => { img.onUpload(f); setDirty(true); } : undefined}
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
