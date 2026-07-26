// Singleton global drag listeners — no DOM mutation, only callbacks

type DropCbs = {
  onFile:  (file: File) => void;
  onEnter: () => void;
  onLeave: () => void;
};

const reg = new Map<string, DropCbs>();
let listening = false;

function getId(e: DragEvent): string | null {
  const el = (e.target as Element | null)?.closest?.('[data-drop-id]');
  return el?.getAttribute('data-drop-id') ?? null;
}

function isInside(id: string, node: Element | null): boolean {
  if (!node) return false;
  const el = document.querySelector(`[data-drop-id="${id}"]`);
  return !!el?.contains(node);
}

function startListening() {
  if (listening) return;
  listening = true;

  document.addEventListener('dragover', (e) => {
    e.preventDefault(); // allow drop
  });

  document.addEventListener('dragenter', (e) => {
    const id = getId(e);
    if (id && reg.has(id)) reg.get(id)!.onEnter();
  });

  document.addEventListener('dragleave', (e) => {
    const id = getId(e);
    if (!id || !reg.has(id)) return;
    // suppress leave when moving between children
    if (isInside(id, e.relatedTarget as Element | null)) return;
    reg.get(id)!.onLeave();
  });

  document.addEventListener('drop', (e) => {
    e.preventDefault();
    const id = getId(e);
    if (!id || !reg.has(id)) return;
    const file = e.dataTransfer?.files?.[0];
    if (file) reg.get(id)!.onFile(file);
    reg.get(id)!.onLeave();
  });
}

export const dropReg = {
  register(id: string, cbs: DropCbs): void {
    startListening();
    reg.set(id, cbs);
  },
  unregister(id: string): void {
    reg.delete(id);
  },
};
