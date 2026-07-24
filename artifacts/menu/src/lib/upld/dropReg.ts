/* Framework-only — no React imports */

interface DrpEnt {
  onFile: (files: FileList) => void;
  onEnter: () => void;
  onLeave: () => void;
}

const reg = new Map<string, DrpEnt>();
let bnd = false;

function near(t: EventTarget | null) {
  return (t as Element | null)?.closest('[data-drop-id]') ?? null;
}

function id(el: Element) {
  return el.getAttribute('data-drop-id') ?? '';
}

function onOver(e: Event) {
  if (near((e as DragEvent).target)) e.preventDefault();
}

function onDrop(e: Event) {
  const ev = e as DragEvent;
  const el = near(ev.target);
  if (!el) return;
  e.preventDefault();
  const ent = reg.get(id(el));
  ent?.onLeave();
  const f = ev.dataTransfer?.files;
  if (f?.length) ent?.onFile(f);
}

function onEnter(e: Event) {
  const el = near((e as DragEvent).target);
  if (el) reg.get(id(el))?.onEnter();
}

function onLeave(e: Event) {
  const ev = e as DragEvent;
  const el = near(ev.target);
  if (el && !el.contains(ev.relatedTarget as Node | null))
    reg.get(id(el))?.onLeave();
}

function bind() {
  if (bnd) return;
  document.addEventListener('dragover',  onOver);
  document.addEventListener('drop',      onDrop);
  document.addEventListener('dragenter', onEnter);
  document.addEventListener('dragleave', onLeave);
  bnd = true;
}

export function bindDz(dropId: string, ent: DrpEnt) {
  bind();
  reg.set(dropId, ent);
  return () => { reg.delete(dropId); };
}
