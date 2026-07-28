import './avt-bg.css';
import './Avt.css';
import './shape/sq.css';
import './shape/plq.css';
import { IcBdr } from './IcBdr';
import { Inits } from './Inits';
import { CrnOr } from './CrnOr';
import { UplBtn } from '../btn/UplBtn';
import { useUpld } from '../../lib/upld/useUpld';

type AvtShape = 'ic' | 'sq' | 'plq';

interface AvtPr {
  src?:        string;
  name?:       string;
  alt?:        string;
  shape?:      AvtShape;
  uploadable?: boolean;
  onUpload?:   (file: File) => void;
  isDragging?: boolean;
}

export function Avt({
  src, name, alt, shape = 'ic',
  uploadable, onUpload, isDragging = false,
}: AvtPr) {
  const upld = useUpld({ onUpload, enabled: !!uploadable });
  const isActive = isDragging || upld.isDrg;

  const mainContent = src
    ? <img src={src} alt={alt ?? name ?? 'Item Image'} className="avt-img" loading="lazy" />
    : uploadable
      ? null
      : <Inits name={name} />;

  const uplControls = uploadable ? (
    <div className={`avt-upl-ctrls${isActive ? ' avt-upl-ctrls--drag' : ''}`}>
      <UplBtn onClick={(e: React.MouseEvent) => { e.stopPropagation(); upld.pick(); }} />
      {!src && <span className="avt-upl-hint ff-s">Click or drop img</span>}
    </div>
  ) : null;

  const dropOverlay = uploadable ? (
    <div className={`avt-drop-ovr${isActive ? ' avt-drop-ovr--on' : ''}`} aria-hidden>
      <span className="avt-drop-here">Drop here</span>
    </div>
  ) : null;

  const avtCls = [
    'avt',
    uploadable             ? 'avt-upl' : '',
    uploadable && isActive ? 'drop-on'  : '',
  ].filter(Boolean).join(' ');

  const shaped = shape === 'ic'
    ? <IcBdr ovr={<>{uplControls}{dropOverlay}</>}>{mainContent}</IcBdr>
    : shape === 'plq'
    ? (
      <div className="avt-shp avt-bg shp-plq">
        {mainContent}
        <CrnOr />
        {uplControls}
        {dropOverlay}
      </div>
    )
    : (
      <div className="avt-shp avt-bg shp-sq">
        {mainContent}
        {uplControls}
        {dropOverlay}
      </div>
    );

  return (
    <div
      className={avtCls}
      onClick={uploadable ? upld.pick : undefined}
      data-drop-id={uploadable ? upld.dropId : undefined}
    >
      {shaped}
    </div>
  );
}
