// Dispatches 'del:cnf' with section title so the modal can show what's being deleted.
// id === section title (used as the section's local key throughout the store).
export function deleteSection(id: string | null): void {
  if (!id) return;
  document.dispatchEvent(new CustomEvent('del:cnf', {
    detail: { id, type: 'section', name: id },
  }));
}
