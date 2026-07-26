import './CnfMdl.css';

export interface CnfMdlPr {
  open:          boolean;
  title:         string;
  message?:      string;
  confirmLabel?: string;
  cancelLabel?:  string;
  onConfirm:     () => void;
  onCancel:      () => void;
}

/**
 * CnfMdl — base confirmation modal.
 * All styling and behaviour lives here. Callers only provide text + callbacks.
 *
 * Usage:
 *   import { CnfMdl } from '@/components/CnfMdl/CnfMdl';
 *   <CnfMdl
 *     open={open}
 *     title="Delete item?"
 *     message="This cannot be undone."
 *     confirmLabel="Delete"
 *     cancelLabel="Cancel"
 *     onConfirm={handleConfirm}
 *     onCancel={handleCancel}
 *   />
 */
export function CnfMdl({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel  = 'Cancel',
  onConfirm,
  onCancel,
}: CnfMdlPr) {
  if (!open) return null;

  return (
    <div className="cnf-bkd" onClick={onCancel} aria-modal role="dialog">
      <div
        className="cnf-box"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative top line */}
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
