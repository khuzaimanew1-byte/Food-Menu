import './avt-bg.css';
import './Avt.css';
import './shape/sq.css';
import './shape/plq.css';
import { IcBdr } from './IcBdr';
import { Inits } from './Inits';
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
  // enabled only when uploadable — no dead store entries on display-only instances
  const upld = useUpld({ onUpload, enabled: !!uploadable });

  // ── Main content (inside shape) ──────────────────────────────────────
  // Normal:   src → Inits(name) → Inits("AV")
  // Upload:   src → "Tap / Drop" hint
  const mainContent = src
    ? <img src={src} alt={alt ?? name ?? 'Item Image'} className="avt-img" loading="lazy" />
    : uploadable
      ? <span className="avt-drop-txt">Tap / Drop</span>
      : <Inits name={name} />;

  // ── Overlay inside shape ─────────────────────────────────────────────
  // Upload mode   → no overlay; the whole avatar is the tap/click target.
  //                 No per-avatar <input> — global upldStore handles picking.
  // Selectable    → checkmark (CSS drives visibility via .avt.chkd).
  // Display-only  → null; no dead DOM node inside a clipped container.
  const overlay = !uploadable && shape === 'ic' && (onSelect !== undefined || checked !== undefined)
    ? (
      <div className="avt-chk" aria-hidden>
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
    )
    : null;

  // ── Root class ───────────────────────────────────────────────────────
  const avtCls = [
    'avt',
    uploadable            ? 'avt-upl' : '',
    !uploadable && checked ? 'chkd'    : '',
    uploadable && upld.isOn ? 'drop-on' : '',
  ].filter(Boolean).join(' ');

  // ── Shape wrapper ────────────────────────────────────────────────────
  const shaped = shape === 'ic'
    ? <IcBdr ovr={overlay}>{mainContent}</IcBdr>
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
      // Upload: whole avatar is the tap/click target (works on mobile too).
      // Normal: delegate to onSelect.
      onClick={uploadable ? upld.pick : onSelect}
      onMouseEnter={uploadable ? upld.hovOn  : undefined}
      onMouseLeave={uploadable ? upld.hovOff : undefined}
      data-drop-id={uploadable ? upld.dropId : undefined}
    >
      {shaped}
    </div>
  );
}
