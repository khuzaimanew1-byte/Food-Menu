// ── AsnMdl — assign modal ──────────────────────────────────────────────────
// Listens for 'assign:open' → resolves item name from menuStore → shows
// staff / resources / margin. Built on BsMdl (wide variant).

import { useState, useEffect, useCallback } from 'react';
import { BsMdl }       from '../BsMdl/BsMdl';
import { PenIco }      from '../icons/PenIco';
import { getSections } from '@/lib/menu/menuStore';
import './AsnMdl.css';

// ── Static sample data (placeholder until DB stores assignments) ────────────
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

// ── Component ───────────────────────────────────────────────────────────────
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
      {/* ── Assign ──────────────────────────────────────────────────── */}
      <div className="asn-sec">
        <span className="sec-lbl">Assign</span>
        <div className="asn-chips">
          {SAMPLE_STF.map(s => (
            <span key={s.name} className="asn-chip">
              <span className="asn-name ff-s">{s.name}</span>
              <span className="bdg bdg--role">{s.role}</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Divider ─────────────────────────────────────────────────── */}
      <div className="sec-div" aria-hidden />

      {/* ── Resources ───────────────────────────────────────────────── */}
      <div className="asn-sec">
        <span className="sec-lbl">Resources</span>
        <div className="asn-chips">
          {SAMPLE_RES.map(r => (
            <span key={r.name} className="asn-chip">
              <span className="asn-name ff-s">{r.name}</span>
              <span className="bdg bdg--qty">{r.qty}</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Margin ──────────────────────────────────────────────────── */}
      <div className="asn-mrow">
        <span className="asn-mlbl ff-s">Margin</span>
        <span className="asn-mval ff-c">{SAMPLE_MRGN}</span>
      </div>
    </BsMdl>
  );
}
