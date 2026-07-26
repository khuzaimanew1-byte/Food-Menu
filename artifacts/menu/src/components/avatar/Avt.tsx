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
  // Upload mode:
  uploadable?: boolean;
  onUpload?:   (file: File) => void;
  /** Card-level drag state — shows drop overlay on avatar even when the drag
   *  is over a non-avatar part of the item card. */
  isDragging?: boolean;
}

export function Avt({
  src, name, alt, shape = 'ic',
  checked, onSelect,
  uploadable, onUpload, isDragging = false,
}: AvtPr) {
  // enabled only when uploadable — no dead store entries on display-only instances
  const upld = useUpld({ onUpload, enabled: !!uploadable });

  // Active only on actual drag (not hover) — card-level or avatar-level
  const isActive = isDragging || upld.isDrg;

  // ── Main content (inside shape) ──────────────────────────────────────
  // Upload empty: original "Tap / Drop" hint
  // Upload with src: image
  // Normal: initials
  const mainContent = src
    ? <img src={src} alt={alt ?? name ?? 'Item Image'} className="avt-img" loading="lazy" />
    : uploadable
      ? <span className="avt-drop-txt">Tap / Drop</span>
      : <Inits name={name} />;

  // ── Drop overlay — inside shape, clipped by ic-poly / overflow:hidden ─
  // Always mounted; CSS transition drives visibility.
  const dropOverlay = uploadable ? (
    <div className={`avt-drop-ovr${isActive ? ' avt-drop-ovr--on' : ''}`} aria-hidden>
      <span className="avt-drop-here">Drop here</span>
    </div>
  ) : null;

  // ── Normal checkmark overlay ─────────────────────────────────────────
  // Upload mode → no checkmark; the whole avatar is the tap/click target.
  const checkOverlay = !uploadable && shape === 'ic' && (onSelect !== undefined || checked !== undefined)
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
    uploadable             ? 'avt-upl' : '',
    !uploadable && checked ? 'chkd'    : '',
    uploadable && isActive ? 'drop-on' : '',
  ].filter(Boolean).join(' ');

  // ── Shape wrapper ────────────────────────────────────────────────────
  const shaped = shape === 'ic'
    ? <IcBdr ovr={<>{checkOverlay}{dropOverlay}</>}>{mainContent}</IcBdr>
    : shape === 'plq'
    ? (
      <div className="avt-shp avt-bg shp-plq">
        {mainContent}
        <CrnOr />
        {checkOverlay}
        {dropOverlay}
      </div>
    )
    : (
      <div className="avt-shp avt-bg shp-sq">
        {mainContent}
        {checkOverlay}
        {dropOverlay}
      </div>
    );

  return (
    <div
      className={avtCls}
      onClick={uploadable ? upld.pick : onSelect}
      onMouseEnter={uploadable ? upld.hovOn  : undefined}
      onMouseLeave={uploadable ? upld.hovOff : undefined}
      data-drop-id={uploadable ? upld.dropId : undefined}
    >
      {shaped}
    </div>
  );
}
