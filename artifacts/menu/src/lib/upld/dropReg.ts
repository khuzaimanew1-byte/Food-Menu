// Global drag-drop singleton — one set of listeners for the whole app.
//
// No registrations, no callbacks.
// Adds/removes 'drg' class on [data-item-id] elements; CSS drives all visuals.
// On drop, queries img[data-img-id="${id}"] and sets src via setImgSrc().

import { setImgSrc } from './upld';

let listening = false;

function getItemEl(e: DragEvent): Element | null {
  return (e.target as Element | null)?.closest?.('[data-item-id]') ?? null;
}

function isInsideEl(el: Element, node: Element | null): boolean {
  return !!node && el.contains(node);
}

/** Remove 'drg' from el and any ancestor [data-item-id] elements. */
function clearDrg(el: Element): void {
  let curr: Element | null = el;
  while (curr) {
    curr.classList.remove('drg');
    const parent: HTMLElement | null = curr.parentElement;
    curr = parent ? parent.closest('[data-item-id]') : null;
  }
}

export function initDrop(): void {
  if (listening) return;
  listening = true;

  document.addEventListener('dragover', (e) => { e.preventDefault(); });

  document.addEventListener('dragenter', (e) => {
    const el = getItemEl(e);
    if (el) el.classList.add('drg');
  });

  document.addEventListener('dragleave', (e) => {
    const el = getItemEl(e);
    if (!el) return;
    // Suppress leave when pointer moves to a child element
    if (isInsideEl(el, e.relatedTarget as Element | null)) return;
    clearDrg(el);
  });

  document.addEventListener('drop', (e) => {
    e.preventDefault();
    const el = getItemEl(e);
    if (!el) return;
    clearDrg(el);
    const id  = el.getAttribute('data-item-id')!;
    const file = e.dataTransfer?.files?.[0];
    if (file) setImgSrc(id, file);
  });
}
