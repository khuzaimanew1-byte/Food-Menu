// Dispatches 'del:cnf' event — DelCnf modal intercepts and calls execDel on confirm.
export function deleteItem(id: string | null): void {
  if (!id) return;
  document.dispatchEvent(new CustomEvent('del:cnf', { detail: { id, type: 'item' } }));
}
