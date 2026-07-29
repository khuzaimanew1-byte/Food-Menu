import { Fragment, useRef, memo } from 'react';
import type { RefObject } from 'react';
import { ICONS, type CtxOpt } from '../ContextMenu/contextMenuConfig';
import './DropdownPanel.css';

export interface SubState {
  optId:  string;
  left:   number;
  top:    number;
  items:  CtxOpt[];
}

export interface DropdownPanelPr {
  left:       number;
  top:        number;
  ariaLabel:  string;
  options:    CtxOpt[];
  onSelect:   (opt: CtxOpt) => void;
  onSubEnter: (opt: CtxOpt, el: HTMLElement) => void;
  onSubLeave: () => void;
  subState:   SubState | null;
  onSubKeep:  () => void;
  menuRef:    RefObject<HTMLDivElement>;
  subMenuRef: RefObject<HTMLDivElement>;
}

interface OptRowPr {
  opt:         CtxOpt;
  onSelect:    (opt: CtxOpt) => void;
  onSubEnter?: (opt: CtxOpt, el: HTMLElement) => void;
  onSubLeave?: () => void;
  active?:     boolean;
}

export const OptRow = memo(function OptRow({ opt, onSelect, onSubEnter, onSubLeave, active }: OptRowPr) {
  const ref = useRef<HTMLLIElement>(null);
  const cls = [
    'ctx-opt',
    opt.children ? 'ctx-opt--sub'      : '',
    opt.danger   ? 'ctx-opt--danger'   : '',
    opt.disabled ? 'disabled'           : '',
    active       ? 'ctx-opt--sub-open' : '',
  ].filter(Boolean).join(' ');

  return (
    <Fragment>
      {opt.separator && <li className="ctx-sep" role="separator" aria-hidden />}
      <li
        ref={ref}
        className={cls}
        role="menuitem"
        aria-haspopup={opt.children ? true : undefined}
        aria-expanded={opt.children ? active : undefined}
        aria-disabled={opt.disabled ?? false}
        tabIndex={opt.disabled ? -1 : 0}
        onClick={() => { if (!opt.children) onSelect(opt); }}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !opt.children) onSelect(opt);
        }}
        onMouseEnter={() => {
          if (opt.children && ref.current && onSubEnter) onSubEnter(opt, ref.current);
          else if (onSubLeave) onSubLeave();
        }}
      >
        <svg className="ctx-opt__icon" viewBox="0 0 24 24" fill="none"
             strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          {opt.icon.map((d) => (
            <path key={d} d={d} stroke="currentColor" strokeWidth="1.5" />
          ))}
        </svg>
        <span className="ctx-opt__label ff-s">{opt.label}</span>
        {opt.hint && (
          <svg className={`ctx-opt__hint ctx-opt__hint--${opt.hint}`}
               viewBox="0 0 24 24" fill="none" aria-hidden>
            {(opt.hint === 'before' ? ICONS.arwUp : ICONS.arwDn).map((d) => (
              <path key={d} d={d} stroke="currentColor" strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round" />
            ))}
          </svg>
        )}
        {opt.children && (
          <svg className="ctx-opt__chevron" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </li>
    </Fragment>
  );
});

export function DropdownPanel({
  left, top, ariaLabel, options,
  onSelect, onSubEnter, onSubLeave,
  subState, onSubKeep,
  menuRef, subMenuRef,
}: DropdownPanelPr) {
  return (
    <>
      <div
        ref={menuRef}
        className="ctx-menu"
        style={{ left, top }}
        role="menu"
        aria-label={ariaLabel}
        onContextMenu={(e) => e.preventDefault()}
      >
        <ul className="ctx-list">
          {options.map((opt) => (
            <OptRow
              key={opt.id}
              opt={opt}
              onSelect={onSelect}
              onSubEnter={onSubEnter}
              onSubLeave={onSubLeave}
              active={subState?.optId === opt.id}
            />
          ))}
        </ul>
      </div>

      {subState && (
        <div
          ref={subMenuRef}
          className="ctx-menu ctx-submenu"
          style={{ left: subState.left, top: subState.top }}
          role="menu"
          onContextMenu={(e) => e.preventDefault()}
          onMouseEnter={onSubKeep}
          onMouseLeave={onSubLeave}
        >
          <ul className="ctx-list">
            {subState.items.map((opt) => (
              <OptRow key={opt.id} opt={opt} onSelect={onSelect} />
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
