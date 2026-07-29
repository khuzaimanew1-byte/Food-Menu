// ── AsnMdl — assign modal ──────────────────────────────────────────────────
// Listens for 'assign:open' → resolves item name from menuStore → shows
// staff / resources / margin. Built on BsMdl (wide variant).

import { useState, useEffect, useCallback } from 'react';
import { BsMdl }       from '../BsMdl/BsMdl';
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

// ── Edit icon (pencil) ──────────────────────────────────────────────────────
function EdtIco() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
         aria-hidden>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

// ── Component ───────────────────────────────────────────────────────────────
export function AsnMdl() {
  const [open,     setOpen]     = useState(false);
  const [itemName, setItemName] = useState('');

  useEffect(() => {
    const handler = (e: Event) => {
      const { id } = (e as CustomEvent<{ id: string | null }>).detail ?? {};
      // Resolve item name from live store
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
      <EdtIco />
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
        <span className="asn-lbl ff-c">Assign</span>
        <div className="asn-chips">
          {SAMPLE_STF.map(s => (
            <span key={s.name} className="asn-chip">
              <span className="asn-name">{s.name}</span>
              <span className="asn-role">{s.role}</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Resources ───────────────────────────────────────────────── */}
      <div className="asn-sec">
        <span className="asn-lbl ff-c">Resources</span>
        <div className="asn-chips">
          {SAMPLE_RES.map(r => (
            <span key={r.name} className="asn-chip">
              <span className="asn-name">{r.name}</span>
              <span className="asn-qty">{r.qty}</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Margin ──────────────────────────────────────────────────── */}
      <div className="asn-mrow">
        <span className="asn-mlbl ff-s">Margin</span>
        <span className="asn-mval">{SAMPLE_MRGN}</span>
      </div>
    </BsMdl>
  );
}
