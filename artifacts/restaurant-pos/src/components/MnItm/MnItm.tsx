import { useState, useEffect, useRef, useCallback } from "react";
import { Avt } from "../avatar/Avt";
import type { MnItem } from "@/data/menu";
import { useUpld } from "@/lib/upld/useUpld";
import { useImgUpld } from "@/lib/upld/useImgUpld";
import { useEdt } from "@/lib/edt/useEdt";
import { setDirty } from "@/lib/edt/edtStore";
import { useMvItem } from "@/lib/mv/useMv";
import { useMvItemActive } from "@/lib/mv/useMvActive";
import { pkFmt } from "@/lib/fmt/fmt";
import "./MnItm.css";

// ── Component-level defaults ──────────────────────────────────────────────
// New items have no field values in the store — these fill in at display time.
const DEF_NAME  = 'New Item';
const DEF_DESC  = 'Description';
const DEF_PRICE = '0';

interface MnItmPr extends MnItem {
  shape?: 'ic' | 'sq' | 'plq';
}

export function MnItm({
  id, name, description, price, image,
  shape = 'ic',
}: MnItmPr) {
  const [sel, setSel]               = useState(false);
  const [editedName,  setEditedName]  = useState<string | null>(null);
  const [editedDesc,  setEditedDesc]  = useState<string | null>(null);
  const [editedPrice, setEditedPrice] = useState<string | null>(null);
  const isActive  = useEdt(String(id));
  const isMoving  = useMvItem(String(id));

  // ── Move drop-target state ─────────────────────────────────────────────
  const mvItemState  = useMvItemActive();
  const isDropTarget = mvItemState.active && !isMoving;
  const wprRef = useRef<HTMLDivElement>(null);

  // Image upload — commit/revert integrated into the edit lifecycle below.
  const img  = useImgUpld(image);
  const upld = useUpld({ onUpload: (f) => { img.onUpload(f); setDirty(true); }, enabled: isActive });

  // Refs to contentEditable nodes for DOM reset on exit.
  const nameRef  = useRef<HTMLHeadingElement>(null);
  const descRef  = useRef<HTMLParagraphElement>(null);
  const priceRef = useRef<HTMLSpanElement>(null);

  // Shadow refs — always hold the latest display values so the exit effect
  // can read them without needing them as deps (fires only on isActive change).
  const displayNameRef  = useRef(editedName  ?? name  ?? DEF_NAME);
  const displayDescRef  = useRef(editedDesc  ?? description ?? DEF_DESC);
  // Raw price string (no formatting) for the contentEditable reset.
  const rawPriceRef     = useRef((editedPrice ?? (price ?? DEF_PRICE).replace(/^Rs\.\s*/i, '').replace(/\D/g, '')) || '0');

  displayNameRef.current  = editedName  ?? name  ?? DEF_NAME;
  displayDescRef.current  = editedDesc  ?? description ?? DEF_DESC;
  rawPriceRef.current     = (editedPrice ?? (price ?? DEF_PRICE).replace(/^Rs\.\s*/i, '').replace(/\D/g, '')) || '0';

  // didSaveRef: set true by the edt:save listener so the exit effect knows
  // whether this deactivation is a Save or a Discard.
  const didSaveRef = useRef(false);

  // Reset selection when entering edit mode.
  useEffect(() => { if (isActive) setSel(false); }, [isActive]);

  // When edit mode activates, set the price span to raw digits (no commas).
  useEffect(() => {
    if (isActive && priceRef.current) {
      priceRef.current.textContent = rawPriceRef.current;
    }
  }, [isActive]);

  // ── edt:save — persist text fields and mark this exit as a Save ──────────
  useEffect(() => {
    const handler = (e: Event) => {
      const d = (e as CustomEvent<{ id: string; fields: Record<string, string> }>).detail;
      if (d?.id !== String(id)) return;
      if (d.fields['name']  !== undefined) setEditedName(d.fields['name']);
      if (d.fields['desc']  !== undefined) setEditedDesc(d.fields['desc']);
      if (d.fields['price'] !== undefined) {
        // Store only digits (strip any accidental non-numeric chars).
        setEditedPrice(d.fields['price'].replace(/\D/g, '') || '0');
      }
      didSaveRef.current = true;
    };
    document.addEventListener('edt:save', handler);
    return () => document.removeEventListener('edt:save', handler);
  }, [id]);

  // ── Unified edit-exit effect ──────────────────────────────────────────────
  useEffect(() => {
    if (!isActive) {
      if (didSaveRef.current) {
        img.commit();
      } else {
        img.revert();
      }
      didSaveRef.current = false;

      // Reset contentEditable nodes to display values (React doesn't diff these).
      if (nameRef.current)  nameRef.current.textContent  = displayNameRef.current;
      if (descRef.current)  descRef.current.textContent  = displayDescRef.current;
      // Reset price span to formatted display value.
      if (priceRef.current) priceRef.current.textContent = pkFmt(rawPriceRef.current);
    }
  }, [isActive, img.commit, img.revert]);

  // ── Price input — digits only ─────────────────────────────────────────────
  const handlePriceInput = useCallback(() => {
    const span = priceRef.current;
    if (!span) return;
    const raw      = span.textContent ?? '';
    const filtered = raw.replace(/\D/g, '');
    if (raw !== filtered) {
      span.textContent = filtered;
      // Move cursor to end after content replacement.
      const sel = window.getSelection();
      const range = document.createRange();
      if (span.firstChild) {
        range.setStart(span.firstChild, filtered.length);
        range.collapse(true);
      } else {
        range.selectNodeContents(span);
        range.collapse(false);
      }
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
    setDirty(true);
  }, []);

  // ── Derived display values ────────────────────────────────────────────────
  const displayName  = editedName  ?? name  ?? DEF_NAME;
  const displayDesc  = editedDesc  ?? description ?? DEF_DESC;
  // Strip legacy "Rs. " prefix from existing data; format with pkFmt.
  const rawPrice     = editedPrice ?? (price ?? DEF_PRICE).replace(/^Rs\.\s*/i, '');
  const displayPrice = pkFmt(rawPrice);

  const cls = [
    'mic-wpr',
    sel          ? 'sel'       : '',
    isActive     ? 'edt-on'   : '',
    isMoving     ? 'disabled'  : '',
    isDropTarget ? 'mv-target' : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      ref={wprRef}
      className={cls}
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
            {/* Price: static "Rs." prefix + editable number */}
            <span className="mic-prow ff-s">
              <span className="mic-pfx" aria-label="Rs." aria-hidden>Rs.</span>
              <span
                ref={priceRef}
                className="mic-price"
                data-edt-field={isActive ? "price" : undefined}
                contentEditable={isActive || undefined}
                suppressContentEditableWarning
                onInput={isActive ? handlePriceInput : undefined}
              >
                {displayPrice}
              </span>
            </span>
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
