import { useState, useEffect, type ReactNode } from "react";
import MnBrd from "../MnBrd/MnBrd";
import MnHdg from "../MnHdg/MnHdg";
import { MnItm } from "../MnItm/MnItm";
import type { PageSect } from "@/data/menu";
import "./CtntPg.css";

interface CtPgPr {
  pgNum: number;
  sections: PageSect[];
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

export function CtntPg({ pgNum, sections }: CtPgPr) {
  return (
    <MnBrd pg={pgNum}>
      <div className="a4-pad cp-in flex flex-col w-full h-full">
        <PgMnt>
          {sections.map((sect, i) => (
            <div key={i} className="cp-sect">
              {sect.title !== undefined && (
                <MnHdg text={sect.title} />
              )}
              {sect.items.length > 0 && (
                <div className="items-grid cp-grid">
                  {sect.items.map(item => (
                    <MnItm key={item.id} {...item} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </PgMnt>
      </div>
    </MnBrd>
  );
}
