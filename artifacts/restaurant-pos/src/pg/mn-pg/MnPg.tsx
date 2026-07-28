import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { PrtBtn }        from "../../components/PrtBtn/PrtBtn";
import { NvCtl }         from "../../components/NvCtl/NvCtl";
import { ContextMenu }   from "../../components/ContextMenu/ContextMenu";
import { EdtCnf }        from "../../components/EdtCnf/EdtCnf";
import { dispatchCtxAction }    from "../../components/ContextMenu/actions";
import { paginateMenuSections } from "../../lib/menu/paginate";
import { getSections }          from "../../lib/menu/menuStore";

import { initSpl, destroySpl } from "../../lib/spl/spl";
import { initEdt, destroyEdt } from "../../lib/edt/edtInit";
import { initMv,  destroyMv  } from "../../lib/mv/mvInit";

import { pgVars } from "./pgVars";
import { rndPg }  from "./rndPg";

export function MnPg() {
  const [curPg, setCurPg] = useState(0);
  const [pages, setPages] = useState(() => paginateMenuSections(getSections()));
  const dir = useRef(1);

  const ttlPg = pages.length + 2;

  useEffect(() => {
    initSpl(); initEdt(); initMv();
    return () => { destroySpl(); destroyEdt(); destroyMv(); };
  }, []);

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

  const goToRef = useRef(goTo);
  useEffect(() => { goToRef.current = goTo; });

  useEffect(() => {
    const handler = (e: Event) => {
      const page = (e as CustomEvent<{ page: number }>).detail?.page;
      if (typeof page === "number") goToRef.current(page);
    };
    document.addEventListener("pg:goto", handler);
    return () => document.removeEventListener("pg:goto", handler);
  }, []);

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
              {rndPg(curPg, pages, ttlPg)}
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
