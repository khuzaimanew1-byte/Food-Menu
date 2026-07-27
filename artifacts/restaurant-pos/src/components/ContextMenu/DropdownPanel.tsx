import { Fragment, useRef } from 'react';
import type { RefObject } from 'react';
import type { CtxOpt } from './contextMenuConfig';
import './DropdownPanel.css';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SubState {
  optId:  string;
  left:   number;
  top:    number;
  items:  CtxOpt[];
}

export interface DropdownPanelPr {
  // Main menu
  left:      number;
  top:       number;
  ariaLabel: string;
  options:   CtxOpt[];
  onSelect:  (opt: CtxOpt) => void;
  onSubEnter:(opt: CtxOpt, el: HTMLElement) => void;
  onSubLeave:() => void;

  // Submenu
  subState:   SubState | null;
  onSubKeep:  () => void;

  // Refs — created in ContextMenu, forwarded here so the controller
  // can do outside-click detection against both panels.
  menuRef:    RefObject<HTMLDivElement>;
  subMenuRef: RefObject<HTMLDivElement>;
}

// ─── Option row ───────────────────────────────────────────────────────────────

interface OptRowPr {
  opt:         CtxOpt;
  onSelect:    (opt: CtxOpt) => void;
  onSubEnter?: (opt: CtxOpt, el: HTMLElement) => void;
  onSubLeave?: () => void;
  active?:     boolean;
}

function OptRow({ opt, onSelect, onSubEnter, onSubLeave, active }: OptRowPr) {
  const ref = useRef<HTMLLIElement>(null);
  const cls = [
    'ctx-opt',
    opt.children ? 'ctx-opt--sub'     : '',
    opt.danger   ? 'ctx-opt--danger'  : '',
    opt.disabled ? 'ctx-opt--disabled': '',
    active       ? 'ctx-opt--sub-open': '',
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
        <svg
          className="ctx-opt__icon"
          viewBox="0 0 24 24"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          {opt.icon.map((d, i) => (
            <path key={i} d={d} stroke="currentColor" strokeWidth="1.5" />
          ))}
        </svg>
        <span className="ctx-opt__label ff-s">{opt.label}</span>
        {opt.children && (
          <svg className="ctx-opt__chevron" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </li>
    </Fragment>
  );
}

// ─── DropdownPanel ────────────────────────────────────────────────────────────

export function DropdownPanel({
  left, top, ariaLabel, options,
  onSelect, onSubEnter, onSubLeave,
  subState, onSubKeep,
  menuRef, subMenuRef,
}: DropdownPanelPr) {
  return (
    <>
      {/* Main menu */}
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

      {/* Submenu flyout */}
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
              <OptRow
                key={opt.id}
                opt={opt}
                onSelect={onSelect}
              />
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
