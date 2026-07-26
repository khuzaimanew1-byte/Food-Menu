// Global file-input singleton — one <input type="file"> for the whole app.
//
// Logic lives here; components only assign a callback under their ID.
// pick(id) routes the chosen file to that callback.
// Drag-and-drop is a separate concern handled by dropReg.ts.

type FileCb = (file: File) => void;

const cbs = new Map<string, FileCb>();
let activeId: string | null = null;
let inp:      HTMLInputElement | null = null;

function getInput(): HTMLInputElement {
  if (inp) return inp;
  inp = document.createElement('input');
  inp.type    = 'file';
  inp.accept  = 'image/jpeg,image/png,image/webp,image/gif';
  inp.style.cssText =
    'position:fixed;top:-999px;left:-999px;opacity:0;pointer-events:none;';
  inp.setAttribute('aria-hidden', 'true');
  // Sentinel: edtInit capture listener skips clicks on this element so
  // programmatic .click() from pick() never triggers edit-mode deactivation.
  inp.setAttribute('data-edt-ignore', '');
  inp.tabIndex = -1;
  document.body.appendChild(inp);

  inp.addEventListener('change', () => {
    const file = inp!.files?.[0];
    if (file && activeId !== null) cbs.get(activeId)?.(file);
    inp!.value = ''; // reset — same file can be re-picked
    activeId   = null;
  });
  return inp;
}

export const upldStore = {
  /** Register a file-received callback under id. */
  register(id: string, cb: FileCb): void {
    cbs.set(id, cb);
  },

  /** Remove the registration; cancel if this id was the active picker. */
  unregister(id: string): void {
    cbs.delete(id);
    if (activeId === id) activeId = null;
  },

  /** Open the global picker; route the chosen file to id's callback. */
  pick(id: string): void {
    if (!cbs.has(id)) return;
    activeId = id;
    getInput().click();
  },
};
