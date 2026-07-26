import { Avt } from '../avatar/Avt';
import './CnfMdl.css';

export interface CnfMdlPr {
  open:          boolean;
  title:         string;
  message?:      string;
  confirmLabel?: string;
  cancelLabel?:  string;
  /** Optional: show the item's crown avatar for context. */
  avatarSrc?:    string;
  avatarName?:   string;
  onConfirm:     () => void;
  onCancel:      () => void;
}

/**
 * CnfMdl — base confirmation modal.
 * dkgl surface, palette-matched backdrop, optional item avatar for context.
 */
export function CnfMdl({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel  = 'Cancel',
  avatarSrc,
  avatarName,
  onConfirm,
  onCancel,
}: CnfMdlPr) {
  if (!open) return null;

  const hasAvt = avatarSrc !== undefined || avatarName !== undefined;

  return (
    <div className="cnf-bkd" onClick={onCancel} aria-modal role="dialog">
      <div
        className="cnf-box"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Item crown avatar — gives the modal context */}
        {hasAvt && (
          <div className="cnf-avt-wrap">
            <div className="cnf-avt-inner">
              <Avt src={avatarSrc} name={avatarName} shape="ic" />
            </div>
          </div>
        )}

        {/* Decorative top rule */}
        <div className="cnf-rule" aria-hidden />

        <h3 className="cnf-ttl ff-s">{title}</h3>

        {message && <p className="cnf-msg ff-s">{message}</p>}

        <div className="cnf-acts">
          <button className="cnf-btn cnf-btn--cancel  ff-s" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button className="cnf-btn cnf-btn--confirm ff-s" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
