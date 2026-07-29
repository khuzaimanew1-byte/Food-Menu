// ── assignStore — in-memory Map of item_id → AssignRecord ─────────────────
// Plain TS module, no React. Dispatches 'assign:change' when state mutates.

import type { AssignRecord } from './asgSync';

export type { AssignRecord };

let _map = new Map<string, AssignRecord>();

function dispatch(): void {
  document.dispatchEvent(new CustomEvent('assign:change'));
}

export function getAssign(itemId: string): AssignRecord | undefined {
  return _map.get(itemId);
}

export function hasAssign(itemId: string): boolean {
  return _map.has(itemId);
}

export function setAssign(record: AssignRecord): void {
  _map.set(record.item_id, record);
  dispatch();
}

export function removeAssign(itemId: string): void {
  if (_map.has(itemId)) {
    _map.delete(itemId);
    dispatch();
  }
}
