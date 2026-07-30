// ── AsnMdl — assign modal ──────────────────────────────────────────────────
// Each section is full-width; content inside is a 2-col grid of kv-rw pairs.
// Odd items flow into col-1 of the next row naturally (grid auto-placement).
// Row/col layout reused for both sections (SSOT via .asn-gd + .kv-rw).
//
// Edit mode (local — not wired to global edtStore):
//  · Edit icon toggles editMode; whole body gets edt-on highlight.
//  · Assign names  → text contentEditable  (asn-edtxt)
//  · Resource names → text contentEditable  (asn-edtxt)
//  · Resource qty numbers → digits-only    (asn-ednum)
//  · Margin number        → digits-only    (asn-ednum)
//  · No <input> elements anywhere.
//  · Save on toggle-off; discard on modal close.

import { useState, useEffect, useCallback, useRef } from 'react';
import { BsMdl }       from '../BsMdl/BsMdl';
import { PenIco }      from '../icons/PenIco';
import { getSections } from '@/lib/menu/menuStore';
import './AsnMdl.css';

interface StfRow { id: string; name: string; role: string; }
interface ResRow { id: string; name: string; qty:  string; }

const INIT_STF: StfRow[] = [
  { id: 'stf-0', name: 'Ahmad', role: 'Chef'             },
  { id: 'stf-1', name: 'Ali',   role: 'Barista'          },
  { id: 'stf-2', name: 'Zia',   role: 'Continental Chef' },
];

const INIT_RES: ResRow[] = [
  { id: 'res-0', name: 'Chicken', qty: '250g' },
  { id: 'res-1', name: 'Oil',     qty: '20ml' },
  { id: 'res-2', name: 'Salt',    qty: '5g'   },
];

const MRGN_PFX = 'Rs.';
const MRGN_NUM = '50';

/** Split "250g" → { num: '250', unit: 'g' }. Falls back to raw qty. */
function splitQty(qty: string): { num: string; unit: string } {
  const m = qty.match(/^([\d.]+)\s*([a-zA-Z]*)$/);
  return m ? { num: m[1], unit: m[2] } : { num: qty, unit: '' };
}

export function AsnMdl() {
  const [open,     setOpen]     = useState(false);
  const [itemName, setItemName] = useState('');
  const [editMode, setEditMode] = useState(false);

  // ── Mutable data state ────────────────────────────────────────────────────
  const [stf,     setStf]     = useState<StfRow[]>(INIT_STF);
  const [res,     setRes]     = useState<ResRow[]>(INIT_RES);
  const [mrgnNum, setMrgnNum] = useState(MRGN_NUM);

  // ── DOM refs for contentEditable nodes ────────────────────────────────────
  const stfNameRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const resNameRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const resNumRefs  = useRef<Array<HTMLSpanElement | null>>([]);
  const mrgnNumRef  = useRef<HTMLSpanElement | null>(null);

  // ── assign:open handler ───────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: Event) => {
      const { id } = (e as CustomEvent<{ id: string | null }>).detail ?? {};
      let name = 'Item';
      if (id) {
        outer: for (const sect of getSections()) {
          for (const item of sect.items) {
            if (item.id === id) { name = item.name ?? 'Item'; break outer; }
          }
        }
      }
      setItemName(name);
      setOpen(true);
    };
    document.addEventListener('assign:open', handler);
    return () => document.removeEventListener('assign:open', handler);
  }, []);

  // Reset edit mode (discard) when modal closes
  useEffect(() => { if (!open) setEditMode(false); }, [open]);

  const close = useCallback(() => setOpen(false), []);

  // ── Digits-only filter — shared by qty / margin number spans ─────────────
  // Strips non-digit chars in real time; preserves cursor position.
  const digitFilter = useCallback((span: HTMLSpanElement | null) => {
    if (!span) return;
    const raw = span.textContent ?? '';
    const flt = raw.replace(/\D/g, '');
    if (raw === flt) return;
    span.textContent = flt;
    const sel = window.getSelection();
    const rng = document.createRange();
    if (span.firstChild) {
      rng.setStart(span.firstChild, flt.length);
      rng.collapse(true);
    } else {
      rng.selectNodeContents(span);
      rng.collapse(false);
    }
    sel?.removeAllRanges();
    sel?.addRange(rng);
  }, []);

  // ── Save — read DOM refs → commit to state ────────────────────────────────
  const saveEdits = useCallback(() => {
    setStf(prev => prev.map((s, i) => ({
      ...s,
      name: stfNameRefs.current[i]?.textContent?.trim() || s.name,
    })));
    setRes(prev => prev.map((r, i) => {
      const nm  = resNameRefs.current[i]?.textContent?.trim() || r.name;
      const num = resNumRefs.current[i]?.textContent?.replace(/\D/g, '') || '';
      const { unit } = splitQty(r.qty);
      return { ...r, name: nm, qty: num + unit };
    }));
    const newNum = mrgnNumRef.current?.textContent?.replace(/\D/g, '');
    if (newNum !== undefined) setMrgnNum(newNum || '0');
  }, []);

  // ── Toggle edit mode ──────────────────────────────────────────────────────
  const toggleEdit = useCallback(() => {
    if (editMode) { saveEdits(); setEditMode(false); }
    else          { setEditMode(true); }
  }, [editMode, saveEdits]);

  // ── Edit button ───────────────────────────────────────────────────────────
  const editBtn = (
    <button
      className={`btn asn-edt${editMode ? ' asn-edt--on' : ''}`}
      aria-label={editMode ? 'Save assignments' : 'Edit assignments'}
      title={editMode ? 'Save' : 'Edit'}
      onClick={toggleEdit}
    >
      <PenIco />
    </button>
  );

  return (
    <BsMdl
      open={open}
      onClose={close}
      title={itemName}
      titleActions={editBtn}
      wide
    >
      {/* Body wrapper — carries edt-on in edit mode for highlight + field styles */}
      <div className={`asn-body${editMode ? ' edt-on' : ''}`}>

        {/* ── Assign ────────────────────────────────────────────────────── */}
        <div className="asn-sec">
          <span className="sec-lbl">Assign</span>
          <div className="asn-gd">
            {stf.map((s, i) => (
              <div key={s.id} className="kv-rw">
                {/* Name — text-edit logic */}
                <span
                  ref={el => { stfNameRefs.current[i] = el; }}
                  className="kv-key ff-s asn-edtxt"
                  contentEditable={editMode || undefined}
                  suppressContentEditableWarning
                >
                  {s.name}
                </span>
                <span className="kv-val ff-s">{s.role}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Resources ─────────────────────────────────────────────────── */}
        <div className="asn-sec">
          <span className="sec-lbl">Resources</span>
          <div className="asn-gd">
            {res.map((r, i) => {
              const { num, unit } = splitQty(r.qty);
              return (
                <div key={r.id} className="kv-rw">
                  {/* Name — text-edit logic */}
                  <span
                    ref={el => { resNameRefs.current[i] = el; }}
                    className="kv-key ff-s asn-edtxt"
                    contentEditable={editMode || undefined}
                    suppressContentEditableWarning
                  >
                    {r.name}
                  </span>
                  <span className="kv-val ff-s">
                    {/* Qty number — digits-only logic */}
                    <span
                      ref={el => { resNumRefs.current[i] = el; }}
                      className={`asn-ednum${editMode ? ' asn-ednum--on' : ''}`}
                      contentEditable={editMode || undefined}
                      suppressContentEditableWarning
                      onInput={editMode ? () => digitFilter(resNumRefs.current[i]) : undefined}
                    >
                      {num}
                    </span>
                    {unit && <span className="asn-unit">{unit}</span>}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Margin ────────────────────────────────────────────────────── */}
        <div className="asn-mrow">
          <span className="asn-mlbl ff-c">Margin</span>
          <span className="asn-mval ff-s">
            <span className="asn-mcur">{MRGN_PFX}</span>{' '}
            {/* Margin number — digits-only logic */}
            <span
              ref={mrgnNumRef}
              className={`asn-ednum${editMode ? ' asn-ednum--on' : ''}`}
              contentEditable={editMode || undefined}
              suppressContentEditableWarning
              onInput={editMode ? () => digitFilter(mrgnNumRef.current) : undefined}
            >
              {mrgnNum}
            </span>
          </span>
        </div>

      </div>
    </BsMdl>
  );
}
