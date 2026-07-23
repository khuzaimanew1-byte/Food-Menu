import { useState, useRef } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";

import { CvrPg } from "./components/CvrPg";
import { ClsPg } from "./components/ClsPg";
import { CtntPg } from "./components/CtntPg/CtntPg";
import { PrtBtn } from "./components/PrtBtn/PrtBtn";
import { NvCtl } from "./components/NvCtl/NvCtl";
import { ARBC, TURK, GRLS, DSRT } from "./data/menu";

const qClt = new QueryClient();

const pgVars = {
  enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:   (d: number) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
};

const ttlPg = 6;

function rndPg(pg: number) {
  switch (pg) {
    case 0:  return <CvrPg />;
    case 1:  return <CtntPg pgNum={1} hdng="Arabic Specialties"               items={ARBC} layout="single"     />;
    case 2:  return <CtntPg pgNum={2} hdng="Turkish Specialties"              items={TURK} layout="two-column" />;
    case 3:  return <CtntPg pgNum={3} hdng="Chef Signatures & Premium Grills" items={GRLS} layout="two-column" />;
    case 4:  return <CtntPg pgNum={4} hdng="Desserts & Premium Selections"    items={DSRT} layout="single"     />;
    default: return <ClsPg />;
  }
}

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
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={qClt}>
      <MnApp />
    </QueryClientProvider>
  );
}
