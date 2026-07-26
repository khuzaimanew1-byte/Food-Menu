// Global file-input singleton — one <input type="file"> for the whole app.
//
// No callbacks, no registrations.
// pick(id) opens the picker; on change, queries img[data-img-id="${id}"]
// and sets src directly via setImgSrc().

import { ACPT, setImgSrc } from './upld';

let activeId: string | null = null;
let inp:      HTMLInputElement | null = null;

function getInput(): HTMLInputElement {
  if (inp) return inp;
  inp = document.createElement('input');
  inp.type    = 'file';
  inp.accept  = ACPT.join(',');
  inp.style.cssText =
    'position:fixed;top:-999px;left:-999px;opacity:0;pointer-events:none;';
  inp.setAttribute('aria-hidden', 'true');
  inp.tabIndex = -1;
  document.body.appendChild(inp);

  inp.addEventListener('change', () => {
    const file = inp!.files?.[0];
    if (file && activeId !== null) setImgSrc(activeId, file);
    inp!.value = ''; // reset so same file can be re-picked
    activeId   = null;
  });
  return inp;
}

export const upldStore = {
  /** Open the global file picker; on choice, update img[data-img-id="${id}"].src. */
  pick(id: string): void {
    activeId = id;
    getInput().click();
  },
};
