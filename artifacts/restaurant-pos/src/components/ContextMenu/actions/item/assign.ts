export function assignItem(id: string | null): void {
  document.dispatchEvent(
    new CustomEvent('assign:open', { detail: { id } }),
  );
}
