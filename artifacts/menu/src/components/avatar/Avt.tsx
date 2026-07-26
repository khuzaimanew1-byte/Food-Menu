import './avt-bg.css';
import './Avt.css';
import './shape/sq.css';
import './shape/plq.css';
import { IcBdr  } from './IcBdr';
import { Inits  } from './Inits';
import { CrnOr  } from './CrnOr';
import { UplBtn } from '../btn/UplBtn';

type AvtShape = 'ic' | 'sq' | 'plq';

interface AvtPr {
  /** When provided, avatar is in upload mode.
   *  - Renders avt-upl-ctrls + avt-drop-ovr (CSS controls visibility)
   *  - img gets data-img-id="${id}"; src is intentionally omitted so
   *    React never takes ownership — global handler sets it via querySelector.
   *  - data-item-id="${id}" on root so click delegation + drop zone work. */
  id?:       string;
  src?:      string;
  name?:     string;
  alt?:      string;
  shape?:    AvtShape;
  // Normal mode:
  checked?:  boolean;
  onSelect?: () => void;
}

export function Avt({
  id, src, name, alt, shape = 'ic',
  checked, onSelect,
}: AvtPr) {
  const isUpload = !!id;

  // ── Main content (inside shape) ──────────────────────────────────────
  // Upload mode: img without src — React never sets it; global handler does.
  // Normal mode: src image → Inits fallback.
  const mainContent = isUpload
    ? (
      <img
        data-img-id={id}
        alt={alt ?? name ?? 'Item image'}
        className="avt-img"
        loading="lazy"
      />
    )
    : src
      ? <img src={src} alt={alt ?? name ?? 'Item image'} className="avt-img" loading="lazy" />
      : <Inits name={name} />;

  // ── Upload controls — UplBtn inside shape ─────────────────────────────
  // display:none by default.
  // .edit-mode [data-item-id] .avt-upl-ctrls → display:flex (CSS)
  // [data-item-id].drg      .avt-upl-ctrls → display:none  (CSS)
  // pointer-events:none — global click delegation owns the click.
  const uplControls = isUpload ? (
    <div className="avt-upl-ctrls">
      <UplBtn />
      <span className="avt-upl-hint ff-s">Click or drop</span>
    </div>
  ) : null;

  // ── Drop overlay — inside shape ───────────────────────────────────────
  // opacity:0 by default; [data-item-id].drg .avt-drop-ovr → opacity:1 (CSS)
  const dropOverlay = isUpload ? (
    <div className="avt-drop-ovr" aria-hidden>
      <span className="avt-drop-here">Drop here</span>
    </div>
  ) : null;

  // ── Normal checkmark overlay ─────────────────────────────────────────
  const checkOverlay = !isUpload && shape === 'ic' &&
    (onSelect !== undefined || checked !== undefined) ? (
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
    ) : null;

  // ── Root class ───────────────────────────────────────────────────────
  const avtCls = [
    'avt',
    isUpload             ? 'avt-upl' : '',
    !isUpload && checked ? 'chkd'    : '',
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
      // data-item-id present only in upload mode — used by global click
      // delegation (upldInit) and drop zone (dropReg) to resolve the item id.
      data-item-id={isUpload ? id : undefined}
      // Normal mode: pass click to onSelect. Upload mode: global delegation
      // on document handles pick(); no local handler needed.
      onClick={isUpload ? undefined : onSelect}
    >
      {shaped}
    </div>
  );
}
