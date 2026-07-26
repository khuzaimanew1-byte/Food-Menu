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

  // Active only on drag — hover does NOT trigger the overlay
  const isActive = isDragging || upld.isDrg;

  // ── Main content (inside shape) ──────────────────────────────────────
  // Upload: always show image when src exists; nothing when empty (controls overlay handles it)
  // Normal: src → Inits(name)
  const mainContent = src
    ? <img src={src} alt={alt ?? name ?? 'Item Image'} className="avt-img" loading="lazy" />
    : uploadable
      ? null
      : <Inits name={name} />;

  // ── Upload controls — UplBtn + hint text, inside shape, clipped ───────
  // display:none on drag (not visibility:hidden — fully removed from layout).
  // UplBtn is pointer-events:none here; parent avt div owns the click.
  // hint text only rendered when no src (img state has no text).
  const uplControls = uploadable ? (
    <div className={`avt-upl-ctrls${isActive ? ' avt-upl-ctrls--drag' : ''}`}>
      <UplBtn />
      {!src && <span className="avt-upl-hint ff-s">Click or drop img</span>}
    </div>
  ) : null;

  // ── Drop overlay — inside shape, clipped by ic-poly / overflow:hidden ─
  // CSS transition drives visibility.
  const dropOverlay = uploadable ? (
    <div className={`avt-drop-ovr${isActive ? ' avt-drop-ovr--on' : ''}`} aria-hidden>
      <span className="avt-drop-here">Drop here</span>
    </div>
  ) : null;

  // ── Normal checkmark overlay ─────────────────────────────────────────
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
    ? <IcBdr ovr={<>{checkOverlay}{uplControls}{dropOverlay}</>}>{mainContent}</IcBdr>
    : shape === 'plq'
    ? (
      <div className="avt-shp avt-bg shp-plq">
        {mainContent}
        <CrnOr />
        {checkOverlay}
        {uplControls}
        {dropOverlay}
      </div>
    )
    : (
      <div className="avt-shp avt-bg shp-sq">
        {mainContent}
        {checkOverlay}
        {uplControls}
        {dropOverlay}
      </div>
    );

  return (
    <div
      className={avtCls}
      onClick={uploadable ? upld.pick : onSelect}
      data-drop-id={uploadable ? upld.dropId : undefined}
    >
      {shaped}
    </div>
  );
}
