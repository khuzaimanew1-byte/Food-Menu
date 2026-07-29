// ── unitStore — global list of units, lazy-loaded ─────────────────────────
// Plain TS module, no React. Dispatches 'unit:change' when state mutates.

import type { UnitRow } from './asgSync';
import { fetchUnits, createUnit, updateUnit, deleteUnit } from './asgSync';

export type { UnitRow };

let _units:  UnitRow[] = [];
let _loaded  = false;
let _loading = false;

function dispatch(): void {
  document.dispatchEvent(new CustomEvent('unit:change'));
}

export function getUnits():   UnitRow[] { return _units; }
export function isUnitsLoaded(): boolean  { return _loaded;  }

/** Load units from API (noop if already loaded). */
export async function loadUnits(): Promise<void> {
  if (_loaded || _loading) return;
  _loading = true;
  try {
    _units  = await fetchUnits();
    _loaded = true;
    dispatch();
  } catch (e) {
    console.error('[unitStore] loadUnits:', e);
  } finally {
    _loading = false;
  }
}

/** Create new unit → insert into store. */
export async function addUnit(name: string): Promise<UnitRow | null> {
  try {
    const u = await createUnit(name);
    _units = [..._units, u];
    dispatch();
    return u;
  } catch (e) {
    console.error('[unitStore] addUnit:', e);
    return null;
  }
}

/** Rename a unit → update store. */
export async function renameUnit(id: string, name: string): Promise<void> {
  try {
    const u = await updateUnit(id, name);
    _units = _units.map(x => x.id === id ? u : x);
    dispatch();
  } catch (e) {
    console.error('[unitStore] renameUnit:', e);
  }
}

/** Delete a unit from store (called after del:cnf confirm). */
export async function execDelUnit(id: string): Promise<void> {
  try {
    await deleteUnit(id);
    _units = _units.filter(u => u.id !== id);
    dispatch();
  } catch (e) {
    console.error('[unitStore] execDelUnit:', e);
  }
}
