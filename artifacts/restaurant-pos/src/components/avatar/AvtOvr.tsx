import './AvtOvr.css';
import '../Button/base.css';
import '../Button/ico-on.css';
import { UpIco } from '../icons/UpIco';

interface AvtOvrPr {
  onClick?: () => void;
  label?:   string;
}

export function AvtOvr({ onClick, label = 'Replace photo' }: AvtOvrPr) {
  return (
    <button
      className="btn btio avt-ovr"
      aria-label={label}
      onClick={onClick}
    >
      <UpIco />
    </button>
  );
}
