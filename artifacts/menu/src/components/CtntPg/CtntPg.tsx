import { useState, useEffect, type ReactNode } from "react";
import MnBrd from "../MnBrd/MnBrd";
import MnHdg from "../MnHdg/MnHdg";
import { MnItm } from "../MnItm/MnItm";
import type { MnItem } from "@/data/menu";
import "./CtntPg.css";

interface CtPgPr {
  pgNum: number;
  hdng: string;
  items: MnItem[];
  layout: "single" | "two-column";
  shCrn?: boolean;
}

/** Mounts children only after the page slide-in animation completes (~400 ms). */
function PgMnt({ children }: { children: ReactNode }) {
  const [rdy, setRdy] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setRdy(true), 400);
    return () => clearTimeout(t);
  }, []);
  if (!rdy) return null;
  return <>{children}</>;
}

export function CtntPg({ pgNum, hdng, items, layout, shCrn = true }: CtPgPr) {
  const lyoCls = layout === "two-column" ? "two-col" : "";
  return (
    <MnBrd pg={pgNum}>
      <div className={`a4-pad cp-in flex flex-col w-full h-full ${lyoCls}`}>
        <MnHdg text={hdng} shCrn={shCrn} />
        <div className="items-grid cp-grid">
          <PgMnt>
            {items.map(item => <MnItm key={item.id} {...item} />)}
          </PgMnt>
        </div>
      </div>
    </MnBrd>
  );
}
