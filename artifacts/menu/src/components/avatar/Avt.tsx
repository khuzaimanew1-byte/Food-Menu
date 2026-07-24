import './avt-bg.css';
import './Avt.css';
import './shape/sq.css';
import { IcBdr } from './IcBdr';
import { UplBtn } from '../btn/UplBtn';
import { AvtOvr } from './AvtOvr';
import { useUpld } from '@/lib/upld/useUpld';
import { ACPT } from '@/lib/upld/upld';

type AvtShp = 'ic' | 'sq';

interface AvtPr {
  src?: string;
  alt?: string;
  shape?: AvtShp;
  onUpload?: (file: File) => void;
}

export function Avt({ src, alt, shape = 'ic', onUpload }: AvtPr) {
  const canUp = !!onUpload;
  const { dropId, pick, inRef, isOn, hovOn, hovOff, onInp } = useUpld({
    onFile: onUpload ?? (() => {}),
  });

  const imgEl = src
    ? <img src={src} alt={alt ?? 'Menu item'} className="avt-img" loading="lazy" />
    : null;

  const ovr   = canUp && src ? <AvtOvr onClick={pick} /> : null;
  const uplEl = canUp && !src ? <UplBtn onClick={pick} /> : null;

  const shpEl = shape === 'ic'
    ? <IcBdr ovr={ovr}>{imgEl ?? uplEl}</IcBdr>
    : (
        <div className="avt-shp avt-bg shp-sq">
          {imgEl ?? uplEl}
          {ovr}
        </div>
      );

  return (
    <div
      className={`avt${canUp ? ` drop-zn${isOn ? ' drop-on' : ''}` : ''}`}
      {...(canUp ? { 'data-drop-id': dropId } : {})}
      onMouseEnter={canUp ? hovOn  : undefined}
      onMouseLeave={canUp ? hovOff : undefined}
    >
      {canUp && (
        <input
          ref={inRef}
          type="file"
          accept={ACPT}
          style={{ display: 'none' }}
          onChange={onInp}
        />
      )}
      {shpEl}
    </div>
  );
}
