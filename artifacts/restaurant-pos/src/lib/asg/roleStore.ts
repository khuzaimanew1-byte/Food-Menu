// ── roleStore — global list of roles, lazy-loaded ─────────────────────────
// Plain TS module, no React. Dispatches 'role:change' when state mutates.

import type { RoleRow } from './asgSync';
import { fetchRoles, createRole, updateRole, deleteRole } from './asgSync';

export type { RoleRow };

let _roles:  RoleRow[] = [];
let _loaded  = false;
let _loading = false;

function dispatch(): void {
  document.dispatchEvent(new CustomEvent('role:change'));
}

export function getRoles():   RoleRow[] { return _roles; }
export function isRolesLoaded(): boolean  { return _loaded;  }

/** Load roles from API (noop if already loaded). */
export async function loadRoles(): Promise<void> {
  if (_loaded || _loading) return;
  _loading = true;
  try {
    _roles  = await fetchRoles();
    _loaded = true;
    dispatch();
  } catch (e) {
    console.error('[roleStore] loadRoles:', e);
  } finally {
    _loading = false;
  }
}

/** Create new role → insert into store. */
export async function addRole(name: string): Promise<RoleRow | null> {
  try {
    const r = await createRole(name);
    _roles = [..._roles, r];
    dispatch();
    return r;
  } catch (e) {
    console.error('[roleStore] addRole:', e);
    return null;
  }
}

/** Rename a role → update store. */
export async function renameRole(id: string, name: string): Promise<void> {
  try {
    const r = await updateRole(id, name);
    _roles = _roles.map(x => x.id === id ? r : x);
    dispatch();
  } catch (e) {
    console.error('[roleStore] renameRole:', e);
  }
}

/** Delete a role from store (called after del:cnf confirm). */
export async function execDelRole(id: string): Promise<void> {
  try {
    await deleteRole(id);
    _roles = _roles.filter(r => r.id !== id);
    dispatch();
  } catch (e) {
    console.error('[roleStore] execDelRole:', e);
  }
}
