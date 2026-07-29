// ── AsgMdl — Assign Modal ─────────────────────────────────────────────────
// Listens to 'asg:open' → opens BsMdl in normal or edit mode.
// Normal mode: shows existing assign data with ✎ to enter edit.
// Edit mode:   editable employee + resource rows; ✓ saves to DB.

import { useState, useEffect, useCallback, useId } from 'react';
import { BsMdl }       from '../BsMdl/BsMdl';
import { EdtDrp }      from '../EdtDrp/EdtDrp';
import {
  getAssign, setAssign, type AssignRecord,
} from '@/lib/asg/assignStore';
import { loadRoles }   from '@/lib/asg/roleStore';
import { loadUnits }   from '@/lib/asg/unitStore';
import { upsertAssign, fetchAssign } from '@/lib/asg/asgSync';
import './AsgMdl.css';

// ── Draft row types ────────────────────────────────────────────────────────

interface EmpDraft  { uid: string; name: string; role_id: string | null }
interface RsrcDraft { uid: string; name: string; qty: string; unit_id: string | null }

let _uid = 0;
const uid = () => String(++_uid);

const mkEmp  = (): EmpDraft  => ({ uid: uid(), name: '', role_id: null });
const mkRsrc = (): RsrcDraft => ({ uid: uid(), name: '', qty: '0', unit_id: null });

// ── Icons ──────────────────────────────────────────────────────────────────

function IcoEdit() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IcoCheck() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IcoPlus() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5"
            strokeLinecap="round" />
    </svg>
  );
}

function IcoTrash() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Component ──────────────────────────────────────────────────────────────

export function AsgMdl() {
  const [open,     setOpen]     = useState(false);
  const [itemId,   setItemId]   = useState<string | null>(null);
  const [itemName, setItemName] = useState('');
  const [mode,     setMode]     = useState<'normal' | 'edit'>('edit');
  const [record,   setRecord]   = useState<AssignRecord | null>(null);
  const [loading,  setLoading]  = useState(false);
  const [saving,   setSaving]   = useState(false);

  // Edit-mode draft state
  const [emps,   setEmps]   = useState<EmpDraft[]>([mkEmp()]);
  const [rsrcs,  setRsrcs]  = useState<RsrcDraft[]>([mkRsrc()]);
  const [margin, setMargin] = useState('0');

  // ── Listen for asg:open event ────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: Event) => {
      const { itemId: iid, itemName: iname } =
        (e as CustomEvent<{ itemId: string; itemName: string }>).detail ?? {};
      if (!iid) return;

      setItemId(iid);
      setItemName(iname ?? '');
      setSaving(false);

      // Kick off role/unit lazy loads
      loadRoles();
      loadUnits();

      // Check store first
      const cached = getAssign(iid);
      if (cached) {
        setRecord(cached);
        setMode('normal');
        setOpen(true);
        return;
      }

      // Fetch from API
      setLoading(true);
      setMode('edit');
      setEmps([mkEmp()]);
      setRsrcs([mkRsrc()]);
      setMargin('0');
      setRecord(null);
      setOpen(true);

      fetchAssign(iid)
        .then(rec => {
          if (rec) {
            setAssign(rec);
            setRecord(rec);
            setMode('normal');
          }
        })
        .catch(() => {/* stay in edit mode */})
        .finally(() => setLoading(false));
    };

    document.addEventListener('asg:open', handler);
    return () => document.removeEventListener('asg:open', handler);
  }, []);

  // ── Populate edit drafts from existing record ────────────────────────────
  const enterEdit = useCallback(() => {
    if (record) {
      setEmps(
        record.employees.length
          ? record.employees.map(e => ({ uid: uid(), name: e.name, role_id: e.role_id }))
          : [mkEmp()],
      );
      setRsrcs(
        record.resources.length
          ? record.resources.map(r => ({ uid: uid(), name: r.name, qty: r.qty, unit_id: r.unit_id }))
          : [mkRsrc()],
      );
      setMargin(record.margin ?? '0');
    } else {
      setEmps([mkEmp()]);
      setRsrcs([mkRsrc()]);
      setMargin('0');
    }
    setMode('edit');
  }, [record]);

  // ── Close ────────────────────────────────────────────────────────────────
  const close = useCallback(() => setOpen(false), []);

  // ── Cancel in edit mode ───────────────────────────────────────────────────
  const cancelEdit = useCallback(() => {
    if (record) {
      setMode('normal');  // revert to normal if record exists
    } else {
      close();            // first time edit — just close
    }
  }, [record, close]);

  // ── Save ─────────────────────────────────────────────────────────────────
  const canSave = rsrcs.some(r => r.name.trim().length > 0);

  const save = useCallback(async () => {
    if (!itemId || saving || !canSave) return;
    setSaving(true);
    try {
      const dto = {
        item_id:   itemId,
        margin:    margin || '0',
        employees: emps
          .filter(e => e.name.trim())
          .map(e => ({ name: e.name.trim(), role_id: e.role_id })),
        resources: rsrcs
          .filter(r => r.name.trim())
          .map(r => ({ name: r.name.trim(), qty: r.qty || '0', unit_id: r.unit_id })),
      };
      const saved = await upsertAssign(dto);
      setAssign(saved);
      setRecord(saved);
      setMode('normal');
    } catch (err) {
      console.error('[AsgMdl] save:', err);
    } finally {
      setSaving(false);
    }
  }, [itemId, saving, canSave, margin, emps, rsrcs]);

  // ── Employee row mutations ────────────────────────────────────────────────
  const updEmp = (uidVal: string, patch: Partial<EmpDraft>) =>
    setEmps(es => es.map(e => e.uid === uidVal ? { ...e, ...patch } : e));
  const delEmp = (uidVal: string) => setEmps(es => es.filter(e => e.uid !== uidVal));
  const addEmp = () => setEmps(es => [...es, mkEmp()]);

  // ── Resource row mutations ────────────────────────────────────────────────
  const updRsrc = (uidVal: string, patch: Partial<RsrcDraft>) =>
    setRsrcs(rs => rs.map(r => r.uid === uidVal ? { ...r, ...patch } : r));
  const delRsrc = (uidVal: string) => setRsrcs(rs => rs.filter(r => r.uid !== uidVal));
  const addRsrc = () => setRsrcs(rs => [...rs, mkRsrc()]);

  // ── Header actions ────────────────────────────────────────────────────────
  const headerActions = (
    <div className="asg-hdr-act">
      {mode === 'normal' ? (
        <button
          className="asg-hdr-btn btn"
          type="button"
          aria-label="Edit assign"
          onClick={enterEdit}
        >
          <IcoEdit />
        </button>
      ) : (
        <button
          className="asg-hdr-btn btn"
          type="button"
          aria-label="Save assign"
          disabled={!canSave || saving}
          onClick={save}
        >
          <IcoCheck />
        </button>
      )}
    </div>
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <BsMdl
      open={open}
      onClose={mode === 'edit' ? cancelEdit : close}
      title={itemName}
      headerActions={headerActions}
      dlgClass={mode === 'edit' ? 'bs-dlg--edt' : undefined}
    >
      <div className="asg-bdy">
        {loading ? (
          <p className="asg-none">Loading…</p>
        ) : mode === 'normal' ? (
          <NormalView record={record} onAddEmp={enterEdit} />
        ) : (
          <EditView
            emps={emps}   updEmp={updEmp}   delEmp={delEmp}   addEmp={addEmp}
            rsrcs={rsrcs} updRsrc={updRsrc} delRsrc={delRsrc} addRsrc={addRsrc}
            margin={margin} setMargin={setMargin}
          />
        )}
      </div>
    </BsMdl>
  );
}

// ── NormalView ─────────────────────────────────────────────────────────────

interface NormalViewPr {
  record:    AssignRecord | null;
  onAddEmp:  () => void;
}

function NormalView({ record, onAddEmp }: NormalViewPr) {
  if (!record) {
    return <p className="asg-none">Not assigned</p>;
  }

  const { employees: emps, resources: rsrcs, margin } = record;

  return (
    <>
      {/* Assign / Employees */}
      <div>
        <p className="asg-lbl ff-s">Assign</p>
        <div className="asg-rows">
          {emps.length === 0 ? (
            <button
              className="asg-add-emp"
              type="button"
              onClick={onAddEmp}
              aria-label="Add employee"
            >
              <IcoPlus />
              Add employee
            </button>
          ) : (
            emps.map(e => (
              <span key={e.id} className="asg-tag ff-s">
                {e.name}
                {e.role_id && <span className="asg-tag__role">{e.role_id}</span>}
              </span>
            ))
          )}
        </div>
      </div>

      {/* Resources */}
      <div>
        <p className="asg-lbl ff-s">Resources</p>
        <div className="asg-rows">
          {rsrcs.length === 0 ? (
            <span className="asg-none">—</span>
          ) : (
            rsrcs.map(r => (
              <span key={r.id} className="asg-tag ff-s">
                {r.name}
                <span className="asg-tag__qty">{r.qty}</span>
                {r.unit_id && <span className="asg-tag__unit">{r.unit_id}</span>}
              </span>
            ))
          )}
        </div>
      </div>

      {/* Margin */}
      <div className="asg-margin ff-s">
        Margin: <span className="asg-margin__val">Rs.{margin ?? '0'}</span>
      </div>
    </>
  );
}

// ── NormalView with role/unit names (resolved from store) ──────────────────
// We use the raw record data; names are resolved on render via role/unitStore.
// (Simplified: shows role_id/unit_id as-is — production would resolve to name)

// ── EditView ───────────────────────────────────────────────────────────────

interface EditViewPr {
  emps:       EmpDraft[];
  updEmp:     (uid: string, patch: Partial<EmpDraft>) => void;
  delEmp:     (uid: string) => void;
  addEmp:     () => void;
  rsrcs:      RsrcDraft[];
  updRsrc:    (uid: string, patch: Partial<RsrcDraft>) => void;
  delRsrc:    (uid: string) => void;
  addRsrc:    () => void;
  margin:     string;
  setMargin:  (v: string) => void;
}

function EditView({
  emps, updEmp, delEmp, addEmp,
  rsrcs, updRsrc, delRsrc, addRsrc,
  margin, setMargin,
}: EditViewPr) {
  return (
    <>
      {/* Employees */}
      <div>
        <p className="asg-lbl ff-s">Assign</p>
        <div className="asg-edit-rows">
          {emps.map(e => (
            <div key={e.uid} className="asg-row">
              <input
                className="asg-inp ff-s"
                value={e.name}
                placeholder="Name"
                onChange={ev => updEmp(e.uid, { name: ev.target.value })}
              />
              <EdtDrp
                type="role"
                value={e.role_id}
                onChange={id => updEmp(e.uid, { role_id: id })}
              />
              {/* Employees: delete always visible */}
              <button
                className="asg-del btn"
                type="button"
                aria-label="Remove employee"
                onClick={() => delEmp(e.uid)}
              >
                <IcoTrash />
              </button>
            </div>
          ))}
          <button className="asg-add-row ff-s" type="button" onClick={addEmp}>
            <IcoPlus /> Add
          </button>
        </div>
      </div>

      {/* Resources */}
      <div>
        <p className="asg-lbl ff-s">Resources</p>
        <div className="asg-edit-rows">
          {rsrcs.map((r, i) => (
            <div key={r.uid} className="asg-row">
              <input
                className="asg-inp ff-s"
                value={r.name}
                placeholder="Resource"
                onChange={ev => updRsrc(r.uid, { name: ev.target.value })}
              />
              <input
                className="asg-inp asg-qty ff-s"
                value={r.qty}
                placeholder="0"
                inputMode="decimal"
                onChange={ev => updRsrc(r.uid, { qty: ev.target.value.replace(/[^0-9.]/g, '') })}
              />
              <EdtDrp
                type="unit"
                value={r.unit_id}
                onChange={id => updRsrc(r.uid, { unit_id: id })}
              />
              {/* Resources: delete only when 2+ rows */}
              {rsrcs.length > 1 && (
                <button
                  className="asg-del btn"
                  type="button"
                  aria-label="Remove resource"
                  onClick={() => delRsrc(r.uid)}
                >
                  <IcoTrash />
                </button>
              )}
            </div>
          ))}
          <button className="asg-add-row ff-s" type="button" onClick={addRsrc}>
            <IcoPlus /> Add
          </button>
        </div>
      </div>

      {/* Margin */}
      <div className="asg-margin ff-s">
        Margin: Rs.
        <input
          className="asg-inp asg-margin__inp ff-s"
          value={margin}
          inputMode="decimal"
          onChange={e => setMargin(e.target.value.replace(/[^0-9.]/g, ''))}
        />
      </div>
    </>
  );
}
