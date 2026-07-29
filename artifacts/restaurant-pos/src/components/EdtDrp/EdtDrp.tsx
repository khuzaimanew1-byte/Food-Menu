// ── EdtDrp — editable dropdown for Role / Unit fields ─────────────────────
// Trigger: ▾ caret only (no border/box).
// Per-option right-click / long-press → context menu: Edit | Delete.
// Edit → inline rename (saved to DB + store).
// Delete → dispatches del:cnf event → existing DelCnf chain.

import {
  useState, useEffect, useRef, useCallback, createPortal,
} from 'react';
import { getRoles, loadRoles, addRole, renameRole } from '@/lib/asg/roleStore';
import { getUnits, loadUnits, addUnit, renameUnit } from '@/lib/asg/unitStore';
import type { RoleRow } from '@/lib/asg/roleStore';
import type { UnitRow } from '@/lib/asg/unitStore';
import './EdtDrp.css';

type DrpType = 'role' | 'unit';
type OptionRow = RoleRow | UnitRow;

interface EdtDrpPr {
  type:     DrpType;
  value:    string | null;   // selected id
  onChange: (id: string | null) => void;
}

interface CtxState { id: string; x: number; y: number }
interface EditState { id: string; value: string }

const LONG_PRESS_MS = 500;

function useOptions(type: DrpType): OptionRow[] {
  const [list, setList] = useState<OptionRow[]>(() =>
    type === 'role' ? getRoles() : getUnits(),
  );
  useEffect(() => {
    const evt = type === 'role' ? 'role:change' : 'unit:change';
    const sync = () => setList(type === 'role' ? getRoles() : getUnits());
    document.addEventListener(evt, sync);
    if (type === 'role') loadRoles(); else loadUnits();
    return () => document.removeEventListener(evt, sync);
  }, [type]);
  return list;
}

export function EdtDrp({ type, value, onChange }: EdtDrpPr) {
  const [open,    setOpen]    = useState(false);
  const [ctx,     setCtx]     = useState<CtxState | null>(null);
  const [editing, setEditing] = useState<EditState | null>(null);
  const [panelPos, setPanelPos] = useState({ top: 0, left: 0 });

  const trigRef  = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const editRef  = useRef<HTMLInputElement>(null);
  const pressRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const options = useOptions(type);
  const selected = options.find(o => o.id === value);

  // ── Open panel ────────────────────────────────────────────────────────────
  const openPanel = useCallback(() => {
    if (!trigRef.current) return;
    const r = trigRef.current.getBoundingClientRect();
    setPanelPos({ top: r.bottom + 4, left: r.left });
    setOpen(true);
  }, []);

  // ── Close panel + context menu on outside click ────────────────────────────
  useEffect(() => {
    if (!open && !ctx) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!panelRef.current?.contains(t) && !trigRef.current?.contains(t)) {
        setOpen(false);
        setCtx(null);
        setEditing(null);
      }
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open, ctx]);

  // ── Focus inline edit input ───────────────────────────────────────────────
  useEffect(() => {
    if (editing) setTimeout(() => editRef.current?.select(), 30);
  }, [editing]);

  // ── Long-press helpers ────────────────────────────────────────────────────
  const startPress = useCallback((id: string, x: number, y: number) => {
    pressRef.current = setTimeout(() => setCtx({ id, x, y }), LONG_PRESS_MS);
  }, []);
  const cancelPress = useCallback(() => {
    if (pressRef.current) { clearTimeout(pressRef.current); pressRef.current = null; }
  }, []);

  // ── Commit rename ─────────────────────────────────────────────────────────
  const commitRename = useCallback(async (id: string, name: string) => {
    const trimmed = name.trim();
    if (!trimmed) { setEditing(null); return; }
    setEditing(null);
    if (type === 'role') await renameRole(id, trimmed);
    else                 await renameUnit(id, trimmed);
  }, [type]);

  // ── Add new option ────────────────────────────────────────────────────────
  const addNew = useCallback(async () => {
    const def = type === 'role' ? 'New Role' : 'New Unit';
    const created = type === 'role' ? await addRole(def) : await addUnit(def);
    if (created) {
      onChange(created.id);
      setOpen(false);
      setEditing({ id: created.id, value: def });
      // reopen briefly so the edit input is visible
      setTimeout(() => setOpen(true), 20);
    }
  }, [type, onChange]);

  // ── Context menu actions ──────────────────────────────────────────────────
  const ctxEdit = useCallback(() => {
    if (!ctx) return;
    const opt = options.find(o => o.id === ctx.id);
    setEditing({ id: ctx.id, value: opt?.name ?? '' });
    setCtx(null);
  }, [ctx, options]);

  const ctxDelete = useCallback(() => {
    if (!ctx) return;
    const opt = options.find(o => o.id === ctx.id);
    document.dispatchEvent(new CustomEvent('del:cnf', {
      detail: { id: ctx.id, type, name: opt?.name ?? '' },
    }));
    setCtx(null);
    setOpen(false);
    if (value === ctx.id) onChange(null);
  }, [ctx, type, value, onChange, options]);

  return (
    <span className="edt-drp">
      {/* Trigger */}
      <button
        ref={trigRef}
        className="edt-drp__trig ff-s"
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={openPanel}
        title={selected?.name ?? (type === 'role' ? 'Role' : 'Unit')}
      >
        <span className="edt-drp__val">
          {selected ? selected.name : <span className="edt-drp__ph">—</span>}
        </span>
        <span className="edt-drp__caret" aria-hidden>▾</span>
      </button>

      {/* Panel (portal) */}
      {open && createPortal(
        <div
          ref={panelRef}
          className="edt-drp__panel"
          style={{ top: panelPos.top, left: panelPos.left }}
          role="listbox"
          aria-label={type === 'role' ? 'Roles' : 'Units'}
        >
          <ul className="edt-drp__list">
            {options.length === 0 && (
              <li className="edt-drp__empty ff-s">No {type}s yet</li>
            )}
            {options.map(opt => (
              <li
                key={opt.id}
                className={[
                  'edt-drp__opt ff-s',
                  value === opt.id ? 'edt-drp__opt--sel' : '',
                ].filter(Boolean).join(' ')}
                role="option"
                aria-selected={value === opt.id}
                onClick={() => { if (editing?.id !== opt.id) { onChange(opt.id); setOpen(false); } }}
                onContextMenu={(e) => { e.preventDefault(); setCtx({ id: opt.id, x: e.clientX, y: e.clientY }); }}
                onPointerDown={(e) => startPress(opt.id, e.clientX, e.clientY)}
                onPointerUp={cancelPress}
                onPointerCancel={cancelPress}
                onPointerMove={cancelPress}
              >
                {editing?.id === opt.id ? (
                  <input
                    ref={editRef}
                    className="edt-drp__inp ff-s"
                    value={editing.value}
                    onChange={e => setEditing(s => s ? { ...s, value: e.target.value } : s)}
                    onBlur={() => commitRename(opt.id, editing.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') { e.preventDefault(); commitRename(opt.id, editing.value); }
                      if (e.key === 'Escape') setEditing(null);
                    }}
                    onClick={e => e.stopPropagation()}
                  />
                ) : (
                  <span className="edt-drp__lbl">{opt.name}</span>
                )}
                {value === opt.id && (
                  <svg className="edt-drp__chk" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="1.5"
                          strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </li>
            ))}
          </ul>
          {/* Add new */}
          <button
            className="edt-drp__add ff-s"
            type="button"
            onClick={addNew}
          >
            <svg viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5"
                    strokeLinecap="round" />
            </svg>
            New {type}
          </button>
        </div>,
        document.body,
      )}

      {/* Per-option context menu */}
      {ctx && createPortal(
        <div
          className="edt-drp__ctx"
          style={{ top: ctx.y, left: ctx.x }}
          role="menu"
        >
          <button className="edt-drp__ctx-opt ff-s" role="menuitem" onClick={ctxEdit}>
            <svg viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Edit
          </button>
          <div className="edt-drp__ctx-sep" role="separator" />
          <button className="edt-drp__ctx-opt edt-drp__ctx-opt--dng ff-s" role="menuitem" onClick={ctxDelete}>
            <svg viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Delete
          </button>
        </div>,
        document.body,
      )}
    </span>
  );
}
