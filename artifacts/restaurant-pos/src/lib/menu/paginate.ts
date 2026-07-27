// ── Pagination — pure function, no React dependency ───────────────────────
// Moved out of App.tsx so App only wires events; logic lives here.

import type { MnItem, PageSect } from '@/data/menu';

export interface PageData {
  pgNum:    number;
  sections: PageSect[];
}

export interface RawSect {
  title: string;
  items: MnItem[];
}

// All values in cqw — must match the A4 layout constants in menu-layout.css
const CONTENT_H = 121;   // usable height per page
const ITEM_H    = 13;    // one MnItm row
const GAP_H     = 3.2;   // items-grid gap
const HDG_H     = 7;     // MnHdg + top/bottom margins
const MIN_RATIO = 0.40;  // push section to next page when < 40% space left

export function paginateMenuSections(raw: RawSect[]): PageData[] {
  const pages: PageData[] = [];
  let currSects: PageSect[] = [];
  let usedH = 0;
  let pgNum = 1;

  const flushPage = () => {
    if (currSects.length > 0) { pages.push({ pgNum, sections: currSects }); pgNum++; }
    currSects = [];
    usedH     = 0;
  };

  const pageHasItems = () => currSects.some(s => s.items.length > 0);

  for (const sect of raw) {
    if (usedH > 0) {
      const remaining = CONTENT_H - usedH;
      if (remaining / CONTENT_H < MIN_RATIO) flushPage();
    }

    currSects.push({ title: sect.title, items: [] });
    usedH += HDG_H;

    for (const item of sect.items) {
      const hasItems = pageHasItems();
      const cost     = ITEM_H + (hasItems ? GAP_H : 0);

      if (usedH + cost > CONTENT_H) {
        flushPage();
        currSects.push({ title: sect.title, isContinuation: true, items: [] });
      }

      const finalCost = ITEM_H + (pageHasItems() ? GAP_H : 0);
      currSects[currSects.length - 1].items.push(item);
      usedH += finalCost;
    }
  }

  flushPage();
  return pages;
}
