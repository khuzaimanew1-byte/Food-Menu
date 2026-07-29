// ── AsnMdl — assign modal ──────────────────────────────────────────────────
// Each section is full-width; content inside is a 2-col grid of kv-rw pairs.
// Odd items flow into col-1 of the next row naturally (grid auto-placement).
// Row/col layout reused for both sections (SSOT via .asn-gd + .kv-rw).

import { useState, useEffect, useCallback } from 'react';
import { BsMdl }       from '../BsMdl/BsMdl';
import { PenIco }      from '../icons/PenIco';
import { getSections } from '@/lib/menu/menuStore';
import './AsnMdl.css';

interface StfRow { name: string; role: string; }
interface ResRow { name: string; qty:  string; }

const SAMPLE_STF: StfRow[] = [
  { name: 'Ahmad', role: 'Chef'             },
  { name: 'Ali',   role: 'Barista'          },
  { name: 'Zia',   role: 'Continental Chef' },
];

const SAMPLE_RES: ResRow[] = [
  { name: 'Chicken', qty: '250g' },
  { name: 'Oil',     qty: '20ml' },
  { name: 'Salt',    qty: '5g'   },
];

const SAMPLE_MRGN = 'Rs. 50';

export function AsnMdl() {
  const [open,     setOpen]     = useState(false);
  const [itemName, setItemName] = useState('');

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

  const close = useCallback(() => setOpen(false), []);

  const editBtn = (
    <button className="btn asn-edt" aria-label="Edit assignments" title="Edit">
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

      {/* ── Assign ──────────────────────────────────────────────────────── */}
      <div className="asn-sec">
        <span className="sec-lbl">Assign</span>
        <div className="asn-gd">
          {SAMPLE_STF.map(s => (
            <div key={s.name} className="kv-rw">
              <span className="kv-key ff-s">{s.name}</span>
              <span className="kv-val ff-s">{s.role}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Resources ───────────────────────────────────────────────────── */}
      <div className="asn-sec">
        <span className="sec-lbl">Resources</span>
        <div className="asn-gd">
          {SAMPLE_RES.map(r => (
            <div key={r.name} className="kv-rw">
              <span className="kv-key ff-s">{r.name}</span>
              <span className="kv-val ff-s">{r.qty}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Margin — bottom-right footer summary ────────────────────────── */}
      <div className="asn-mrow">
        <span className="asn-mlbl ff-s">Margin</span>
        <span className="asn-mval ff-s">{SAMPLE_MRGN}</span>
      </div>

    </BsMdl>
  );
}
