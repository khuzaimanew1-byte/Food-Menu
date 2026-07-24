import '../Button/base.css';
import '../Button/ico-on.css';
import './UplBtn.css';
import { UpIco } from '../icons/UpIco';

interface UplBtnPr {
  label?: string;
  onClick?: () => void;
}

export function UplBtn({ label = 'Upload photo', onClick }: UplBtnPr) {
  return (
    <button className="btn btio upl-btn" aria-label={label} onClick={onClick}>
      <UpIco />
    </button>
  );
}
