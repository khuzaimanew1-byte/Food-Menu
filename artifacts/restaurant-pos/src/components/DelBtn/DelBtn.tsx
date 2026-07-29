// ── DelBtn — reusable delete button ──────────────────────────────────────
// Built on the .btn base. Accepts item or section type.
// Positions absolute inside any position:relative parent.

import { deleteItem }    from '@/components/ContextMenu/actions/item/del';
import { deleteSection } from '@/components/ContextMenu/actions/section/del';
import './DelBtn.css';

export interface DelBtnPr {
  id:   string;
  type: 'item' | 'section';
}

export function DelBtn({ id, type }: DelBtnPr) {
  return (
    <button
      className="btn del-btn"
      aria-label="Delete"
      onClick={(e) => {
        e.stopPropagation();
        type === 'item' ? deleteItem(id) : deleteSection(id);
      }}
    >
      <svg viewBox="0 0 16 16" fill="none" aria-hidden>
        <path d="M2 4h12"
          stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
        <path d="M5.333 4V2.667h5.334V4"
          stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3.333 4l.834 9.333h7.666L12.667 4"
          stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6.667 7.333v3.334M9.333 7.333v3.334"
          stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      </svg>
    </button>
  );
}
