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
import { MinusButton } from "../buttons/MinusButton/MinusButton";
import { QuantityInput } from "../inputs/QuantityInput/QuantityInput";
import { DelBtn } from "../DelBtn/DelBtn";
import "./MnItm.css";

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
  const [qty, setQty]                 = useState(0);
  const [editedName,  setEditedName]  = useState<string | null>(null);
  const [editedDesc,  setEditedDesc]  = useState<string | null>(null);
  const [editedPrice, setEditedPrice] = useState<string | null>(null);
  const isActive  = useEdt(String(id));
  const isMoving  = useMvItem(String(id));

  const mvItemState  = useMvItemActive();
  const isDropTarget = mvItemState.active && !isMoving;
  const wprRef = useRef<HTMLDivElement>(null);

  const img  = useImgUpld(image);
  const upld = useUpld({ onUpload: (f) => { img.onUpload(f); setDirty(true); }, enabled: isActive });

  const nameRef  = useRef<HTMLHeadingElement>(null);
  const descRef  = useRef<HTMLParagraphElement>(null);
  const priceRef = useRef<HTMLSpanElement>(null);

  const displayNameRef  = useRef(editedName  ?? name  ?? DEF_NAME);
  const displayDescRef  = useRef(editedDesc  ?? description ?? DEF_DESC);
  const rawPriceRef     = useRef((editedPrice ?? (price ?? DEF_PRICE).replace(/^Rs\.\s*/i, '').replace(/\D/g, '')) || '0');

  displayNameRef.current  = editedName  ?? name  ?? DEF_NAME;
  displayDescRef.current  = editedDesc  ?? description ?? DEF_DESC;
  rawPriceRef.current     = (editedPrice ?? (price ?? DEF_PRICE).replace(/^Rs\.\s*/i, '').replace(/\D/g, '')) || '0';

  const didSaveRef = useRef(false);

  useEffect(() => { if (isActive) setQty(0); }, [isActive]);

  useEffect(() => {
    if (isActive && priceRef.current) {
      priceRef.current.textContent = rawPriceRef.current;
    }
  }, [isActive]);

  useEffect(() => {
    const handler = (e: Event) => {
      const d = (e as CustomEvent<{ id: string; fields: Record<string, string> }>).detail;
      if (d?.id !== String(id)) return;
      if (d.fields['name']  !== undefined) setEditedName(d.fields['name']);
      if (d.fields['desc']  !== undefined) setEditedDesc(d.fields['desc']);
      if (d.fields['price'] !== undefined) {
        setEditedPrice(d.fields['price'].replace(/\D/g, '') || '0');
      }
      didSaveRef.current = true;
    };
    document.addEventListener('edt:save', handler);
    return () => document.removeEventListener('edt:save', handler);
  }, [id]);

  useEffect(() => {
    if (!isActive) {
      if (didSaveRef.current) {
        img.commit();
      } else {
        img.revert();
      }
      didSaveRef.current = false;
      if (nameRef.current)  nameRef.current.textContent  = displayNameRef.current;
      if (descRef.current)  descRef.current.textContent  = displayDescRef.current;
      if (priceRef.current) priceRef.current.textContent = pkFmt(rawPriceRef.current);
    }
  }, [isActive, img.commit, img.revert]);

  const handlePriceInput = useCallback(() => {
    const span = priceRef.current;
    if (!span) return;
    const raw      = span.textContent ?? '';
    const filtered = raw.replace(/\D/g, '');
    if (raw !== filtered) {
      span.textContent = filtered;
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

  const sel = qty > 0;

  const displayName  = editedName  ?? name  ?? DEF_NAME;
  const displayDesc  = editedDesc  ?? description ?? DEF_DESC;
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
      onClick={isActive ? undefined : () => setQty(q => q + 1)}
    >
      {!isActive && <DelBtn id={String(id)} type="item" />}
      {sel && !isActive && (
        <div className="mic-qty">
          <MinusButton onClick={(e) => { e.stopPropagation(); setQty(q => Math.max(0, q - 1)); }} />
          <QuantityInput value={qty} onChange={(n) => setQty(Math.max(0, n))} />
        </div>
      )}
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
