import '../Button/base.css';
import './AvtOvr.css';
import { UpIco } from '../icons/UpIco';

interface AvrPr { onClick: () => void; }

export function AvtOvr({ onClick }: AvrPr) {
  return (
    <button className="btn avt-ovr" onClick={onClick} aria-label="Replace image">
      <UpIco />
    </button>
  );
}
