// ── MnPg — Menu page ──────────────────────────────────────────────────────
// Full page definition: which pages exist, in what order, pagination state.
// App.tsx mounts this; it knows nothing about page structure itself.
//
// Page-level systems (spl, edt, mv) are init/destroyed here — not in
// main.tsx — so they are strictly scoped to this page's lifetime.

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { CvrPg }   from "../../components/CvrPg";
import { ClsPg }   from "../../components/ClsPg";
import { CtntPg }  from "../../components/CtntPg/CtntPg";
import { PrtBtn }  from "../../components/PrtBtn/PrtBtn";
import { NvCtl }   from "../../components/NvCtl/NvCtl";
import { ContextMenu } from "../../components/ContextMenu/ContextMenu";
import { EdtCnf }  from "../../components/EdtCnf/EdtCnf";
import { dispatchCtxAction }    from "../../components/ContextMenu/actions";
import { paginateMenuSections } from "../../lib/menu/paginate";
import { getSections }          from "../../lib/menu/menuStore";

import { initSpl, destroySpl } from "../../lib/spl/spl";
import { initEdt, destroyEdt } from "../../lib/edt/edtInit";
import { initMv,  destroyMv  } from "../../lib/mv/mvInit";

const pgVars = {
  enter:  (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:   (d: number) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
};

export function MnPg() {
  const [curPg, setCurPg] = useState(0);
  const [pages,  setPages]  = useState(() => paginateMenuSections(getSections()));
  const dir = useRef(1);

  const ttlPg = pages.length + 2; // cover + content pages + closing

  // ── Page-level system init/destroy ────────────────────────────────────────
  useEffect(() => {
    initSpl();
    initEdt();
    initMv();
    return () => {
      destroySpl();
      destroyEdt();
      destroyMv();
    };
  }, []);

  // ── Re-paginate whenever menu order changes ───────────────────────────────
  useEffect(() => {
    const handler = () => setPages(paginateMenuSections(getSections()));
    document.addEventListener("menu:change", handler);
    return () => document.removeEventListener("menu:change", handler);
  }, []);

  const goPrv = () => { dir.current = -1; setCurPg(p => Math.max(0, p - 1)); };
  const goNxt = () => { dir.current =  1; setCurPg(p => Math.min(ttlPg - 1, p + 1)); };
  const goTo  = (p: number) => {
    dir.current = p > curPg ? 1 : -1;
    setCurPg(Math.max(0, Math.min(ttlPg - 1, p)));
  };

  // Stable ref so pg:goto listener always calls the latest goTo closure
  // without needing to re-register the listener on every curPg change.
  const goToRef = useRef(goTo);
  useEffect(() => { goToRef.current = goTo; });

  // ── pg:goto — navigate to a specific page (dispatched by add actions) ─────
  useEffect(() => {
    const handler = (e: Event) => {
      const page = (e as CustomEvent<{ page: number }>).detail?.page;
      if (typeof page === "number") goToRef.current(page);
    };
    document.addEventListener("pg:goto", handler);
    return () => document.removeEventListener("pg:goto", handler);
  }, []); // stable — reads goToRef.current which is always fresh

  // ── Page registry — add new page types here, nowhere else ────────────────
  function rndPg(pg: number) {
    if (pg === 0)          return <CvrPg />;
    if (pg === ttlPg - 1)  return <ClsPg />;
    const pd = pages[pg - 1];
    return <CtntPg pgNum={pd.pgNum} sections={pd.sections} />;
  }

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
        <EdtCnf />
      </div>
      <PrtBtn />
      <ContextMenu onSelect={dispatchCtxAction} />
    </div>
  );
}
