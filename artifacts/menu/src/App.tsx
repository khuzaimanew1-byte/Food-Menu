import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { CvrPg } from "./components/CvrPg";
import { ClsPg } from "./components/ClsPg";
import { CtntPg } from "./components/CtntPg/CtntPg";
import { PrtBtn } from "./components/PrtBtn/PrtBtn";
import { NvCtl } from "./components/NvCtl/NvCtl";
import { AvtDmo } from "./components/AvtDmo/AvtDmo";
import { ContextMenu } from "./components/ContextMenu/ContextMenu";
import { dispatchCtxAction } from "./components/ContextMenu/actions";
import { SmMdl } from "./components/SmMdl/SmMdl";
import { saveAndDeactivate, deactivate, getActive } from "./lib/edt/edtStore";
import { ARBC, TURK } from "./data/menu";
import type { MnItem, PageSect } from "./data/menu";

const ALL_ITEMS: MnItem[] = [...ARBC, ...TURK];

const pgVars = {
  enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:   (d: number) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
};

// ── Pagination constants (all in cqw) ──────────────────────────────────────
// A4 container: height = 297/210 * 100cqw ≈ 141.4cqw
// Content area: 141.4 - 9 (pad-top) - 11 (pad-bottom) = 121.4cqw
const CONTENT_H = 121;   // available content height per page
const ITEM_H    = 13;    // height of one MnItm (avatar is a 13cqw square)
const GAP_H     = 3.2;   // items-grid gap between consecutive items
const HDG_H     = 7;     // MnHdg height including its 1cqw top+bottom margins
const MIN_RATIO = 0.40;  // if remaining < 40% of page, push section to next page

// ── Types ──────────────────────────────────────────────────────────────────
interface PageData {
  pgNum: number;
  sections: PageSect[];
}

// ── Pagination algorithm ───────────────────────────────────────────────────
function paginateMenuSections(
  raw: { title: string; items: MnItem[] }[]
): PageData[] {
  const pages: PageData[] = [];
  let currSects: PageSect[] = [];
  let usedH = 0;
  let pgNum = 1;

  /** Commit the current page and reset state. */
  const flushPage = () => {
    if (currSects.length > 0) {
      pages.push({ pgNum, sections: currSects });
      pgNum++;
    }
    currSects = [];
    usedH = 0;
  };

  /** True if any section on the current page already has items. */
  const pageHasItems = () => currSects.some(s => s.items.length > 0);

  for (const sect of raw) {
    // ── 40% rule: if page is non-empty and less than 40% space remains,
    //    push the new section to the next page instead.
    if (usedH > 0) {
      const remaining = CONTENT_H - usedH;
      if (remaining / CONTENT_H < MIN_RATIO) {
        flushPage();
      }
    }

    currSects.push({ title: sect.title, items: [] });
    usedH += HDG_H;

    // ── Distribute items, overflowing onto new pages as needed.
    for (const item of sect.items) {
      // Cost of this item: first item on the page has no gap above it.
      const hasItems = pageHasItems();
      const cost = ITEM_H + (hasItems ? GAP_H : 0);

      if (usedH + cost > CONTENT_H) {
        // Item doesn't fit → flush and start a continuation section.
        flushPage();
        currSects.push({ title: undefined, items: [] });
      }

      // Re-evaluate cost after a potential page flush (first item on new page
      // has no gap; otherwise the earlier `hasItems` check still holds).
      const finalCost = ITEM_H + (pageHasItems() ? GAP_H : 0);
      currSects[currSects.length - 1].items.push(item);
      usedH += finalCost;
    }
  }

  flushPage(); // commit the last page
  return pages;
}

// ── Build pages once at module level ──────────────────────────────────────
const MENU_PAGES = paginateMenuSections([
  { title: "Arabic Specialties",  items: ARBC },
  { title: "Turkish Specialties", items: TURK },
]);

const ttlPg = MENU_PAGES.length + 2; // cover + content pages + closing

function rndPg(pg: number) {
  if (pg === 0)          return <CvrPg />;
  if (pg === ttlPg - 1)  return <ClsPg />;
  const pd = MENU_PAGES[pg - 1];
  return <CtntPg pgNum={pd.pgNum} sections={pd.sections} />;
}

// ── Edit confirmation modal ────────────────────────────────────────────────
function EdtCnf() {
  const [open, setOpen]         = useState(false);
  const [avtItem, setAvtItem]   = useState<MnItem | null>(null);

  useEffect(() => {
    const show = () => {
      const { activeId } = getActive();
      const item = ALL_ITEMS.find(i => String(i.id) === activeId) ?? null;
      setAvtItem(item);
      setOpen(true);
    };
    document.addEventListener('edt:confirm-needed', show);
    return () => document.removeEventListener('edt:confirm-needed', show);
  }, []);

  return (
    <SmMdl
      open={open}
      title="Save changes?"
      confirmLabel="Save"
      avatarSrc={avtItem?.image}
      avatarName={avtItem?.name}
      onConfirm={() => { setOpen(false); saveAndDeactivate(); }}
      onClose={() => { setOpen(false); deactivate(); }}
    />
  );
}

// ── Main app ───────────────────────────────────────────────────────────────
function MnApp() {
  const [curPg, setCurPg] = useState(0);
  const dir = useRef(1);

  const goPrv = () => { dir.current = -1; setCurPg(p => Math.max(0, p - 1)); };
  const goNxt = () => { dir.current =  1; setCurPg(p => Math.min(ttlPg - 1, p + 1)); };
  const goTo  = (p: number) => {
    dir.current = p > curPg ? 1 : -1;
    setCurPg(Math.max(0, Math.min(ttlPg - 1, p)));
  };

  return (
    <div className="stage">
      <div className="pg-wrap">
        <div className="a4-box">
          <AnimatePresence initial={false} custom={dir.current} mode="sync">
            <motion.div
              key={curPg}
              custom={dir.current}
              variants={pgVars}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.38, ease: [0.4, 0, 0.2, 1] }}
              style={{ position: "absolute", inset: 0 }}
            >
              {rndPg(curPg)}
            </motion.div>
          </AnimatePresence>
        </div>
        <NvCtl curPg={curPg} ttlPg={ttlPg} onPrev={goPrv} onNext={goNxt} onGoto={goTo} />
      </div>
      {/* viewport-fixed */}
      <PrtBtn />
      <ContextMenu onSelect={dispatchCtxAction} />
      <EdtCnf />
    </div>
  );
}

export default function App() {
  const isDemo = new URLSearchParams(window.location.search).has("demo");
  return isDemo ? <AvtDmo /> : <MnApp />;
}
