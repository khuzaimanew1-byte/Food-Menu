import './avt-bg.css';
import './Avt.css';
import './shape/sq.css';
import './shape/plq.css';
import { IcBdr } from './IcBdr';
import { Inits } from './Inits';
import { AvtOvr } from './AvtOvr';
import { CrnOr } from './CrnOr';
import { useUpld } from '../../lib/upld/useUpld';

type AvtShape = 'ic' | 'sq' | 'plq';

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
  // enabled only when uploadable — prevents a dead dropReg entry on every
  // non-uploadable avatar instance
  const upld = useUpld({ onUpload, enabled: !!uploadable });

  // ── Main content (inside shape) ──────────────────────────────────────
  // Priority: src → Inits(name) → Inits("AV")   [normal]
  //           src → drop-hint text               [upload, no src]
  const mainContent = src
    ? <img src={src} alt={alt ?? name ?? 'Item Image'} className="avt-img" loading="lazy" />
    : uploadable
      ? <span className="avt-drop-txt">Drop here</span>
      : <Inits name={name} />;

  // ── Overlay inside ic-inn / avt-shp ─────────────────────────────────
  // Normal mode: checkmark div (CSS drives visibility via .avt.chkd)
  // Upload mode (no src): drop hint only — no overlay button
  // Upload mode (has src): hidden input + AvtOvr replace button (shown via .drop-on)
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
      {src && <AvtOvr onClick={upld.pick} />}
    </>
  ) : (
    <div className="avt-chk" aria-hidden>
      {/* SVG checkmark — font-independent, always renders */}
      <svg className="avt-mk" viewBox="0 0 24 24" fill="none" aria-hidden>
        <polyline
          points="20 6 9 17 4 12"
          stroke="currentColor"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
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
    : shape === 'plq'
    ? (
      <div className="avt-shp avt-bg shp-plq">
        {mainContent}
        <CrnOr />
        {overlay}
      </div>
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
