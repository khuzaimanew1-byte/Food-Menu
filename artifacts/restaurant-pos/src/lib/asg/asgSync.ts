// ── asgSync — fire-and-forget API helpers for assign / roles / units ──────
// Plain TS module. No imports from stores (avoids circular deps).

const BASE = '/api';

// ── Types ─────────────────────────────────────────────────────────────────

export interface RoleRow { id: string; name: string }
export interface UnitRow { id: string; name: string }

export interface EmpRow {
  id:        string;
  assign_id: string;
  name:      string;
  role_id:   string | null;
  pos:       number;
}

export interface RsrcRow {
  id:        string;
  assign_id: string;
  name:      string;
  qty:       string;
  unit_id:   string | null;
  pos:       number;
}

export interface AssignRecord {
  id:        string;
  item_id:   string;
  margin:    string;
  employees: EmpRow[];
  resources: RsrcRow[];
}

export interface UpsertDto {
  item_id:   string;
  margin:    string;
  employees: { name: string; role_id: string | null }[];
  resources: { name: string; qty: string; unit_id: string | null }[];
}

// ── Core fetch helper ──────────────────────────────────────────────────────

async function api<T = unknown>(path: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, opts);
  if (res.status === 204) return null as T;
  if (!res.ok) {
    const txt = await res.text().catch(() => String(res.status));
    throw new Error(`[asgSync] ${res.status}: ${txt}`);
  }
  return res.json() as Promise<T>;
}

const json = (body: unknown) => ({
  method: 'POST' as const,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

// ── Assign ─────────────────────────────────────────────────────────────────

export function fetchAssign(itemId: string): Promise<AssignRecord | null> {
  return api(`/assigns?item_id=${encodeURIComponent(itemId)}`);
}

export function upsertAssign(dto: UpsertDto): Promise<AssignRecord> {
  return api('/assigns', json(dto));
}

// ── Roles ──────────────────────────────────────────────────────────────────

export const fetchRoles  = (): Promise<RoleRow[]>  => api('/roles');
export const createRole  = (name: string): Promise<RoleRow>  => api('/roles', json({ name }));
export const updateRole  = (id: string, name: string): Promise<RoleRow>  =>
  api(`/roles/${id}`, { ...json({ name }), method: 'PATCH' });
export const deleteRole  = (id: string): Promise<null>  =>
  api(`/roles/${id}`, { method: 'DELETE' });

// ── Units ──────────────────────────────────────────────────────────────────

export const fetchUnits  = (): Promise<UnitRow[]>  => api('/units');
export const createUnit  = (name: string): Promise<UnitRow>  => api('/units', json({ name }));
export const updateUnit  = (id: string, name: string): Promise<UnitRow>  =>
  api(`/units/${id}`, { ...json({ name }), method: 'PATCH' });
export const deleteUnit  = (id: string): Promise<null>  =>
  api(`/units/${id}`, { method: 'DELETE' });
