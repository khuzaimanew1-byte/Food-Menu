import './avt-bg.css';
import './Avt.css';
import './shape/sq.css';
import { IcBdr } from './IcBdr';
import { Inits } from './Inits';
import { AvtOvr } from './AvtOvr';
import { UplBtn } from '../btn/UplBtn';
import { useUpld } from '../../lib/upld/useUpld';

type AvtShape = 'ic' | 'sq';

interface AvtPr {
  src?:        string;
  name?:       string;
  alt?:        string;
  shape?:      AvtShape;
  // Normal mode (default):
  checked?:    boolean;
  onSelect?:   () => void;
  // Upload mode (uploadable flag activates — unmounts checkbox entirely):
  uploadable?: boolean;
  onUpload?:   (file: File) => void;
}

export function Avt({
  src, name, alt, shape = 'ic',
  checked, onSelect,
  uploadable, onUpload,
}: AvtPr) {
  const upld = useUpld({ onUpload });

  // ── Main content (inside shape) ──────────────────────────────────────
  // Priority: src → Inits(name) → Inits("AV")   [normal]
  //           src → UplBtn                       [upload, no src]
  const mainContent = src
    ? <img src={src} alt={alt ?? name ?? 'Item Image'} className="avt-img" loading="lazy" />
    : uploadable
      ? <UplBtn onClick={upld.pick} />
      : <Inits name={name} />;

  // ── Overlay inside ic-inn / avt-shp ─────────────────────────────────
  // Normal mode: checkmark div (CSS drives visibility via .avt.chkd)
  // Upload mode: hidden file input + AvtOvr button (shown via .drop-on)
  const overlay = uploadable ? (
    <>
      <input
        ref={upld.inRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="avt-inp"
        onChange={upld.onInp}
        aria-hidden
        tabIndex={-1}
      />
      <AvtOvr onClick={upld.pick} />
    </>
  ) : (
    <div className="avt-chk" aria-hidden>
      <span className="avt-mk">✓</span>
    </div>
  );

  // ── Root class ───────────────────────────────────────────────────────
  const avtCls = [
    'avt',
    !uploadable && checked ? 'chkd' : '',
    uploadable  && upld.isOn ? 'drop-on' : '',
  ].filter(Boolean).join(' ');

  // ── Shape wrapper ────────────────────────────────────────────────────
  const shaped = shape === 'ic'
    ? (
      <IcBdr ovr={overlay}>{mainContent}</IcBdr>
    )
    : (
      <div className="avt-shp avt-bg shp-sq">
        {mainContent}
        {overlay}
      </div>
    );

  return (
    <div
      className={avtCls}
      onClick={!uploadable ? onSelect : undefined}
      onMouseEnter={uploadable ? upld.hovOn  : undefined}
      onMouseLeave={uploadable ? upld.hovOff : undefined}
      data-drop-id={uploadable ? upld.dropId : undefined}
    >
      {shaped}
    </div>
  );
}
