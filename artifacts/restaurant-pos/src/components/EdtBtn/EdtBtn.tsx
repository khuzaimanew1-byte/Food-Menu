import { activate } from '@/lib/edt/edtStore';
import type { EdtType } from '@/lib/edt/edtStore';
import { PenIco } from '../icons/PenIco';
import './EdtBtn.css';

interface EdtBtnPr {
  id:   string;
  type: EdtType;
}

export function EdtBtn({ id, type }: EdtBtnPr) {
  return (
    <button
      className="edt-btn"
      data-edt-id={id}
      data-edt-type={type}
      aria-label="Edit"
      onClick={(e) => {
        e.stopPropagation();
        activate(id, type);
      }}
    >
      <PenIco />
    </button>
  );
}
