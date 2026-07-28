import { useState, useEffect, memo, type ReactNode } from "react";
import MnBrd        from "../MnBrd/MnBrd";
import { MnSect }   from "../MnSect/MnSect";
import type { PageSect } from "@/data/menu";
import "./CtntPg.css";

interface CtPgPr {
  pgNum:    number;
  sections: PageSect[];
}

const PgMnt = memo(function PgMnt({ children }: { children: ReactNode }) {
  const [rdy, setRdy] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setRdy(true), 400);
    return () => clearTimeout(t);
  }, []);
  if (!rdy) return null;
  return <>{children}</>;
});

export function CtntPg({ pgNum, sections }: CtPgPr) {
  return (
    <MnBrd pg={pgNum}>
      <div className="a4-pad cp-in flex flex-col w-full h-full">
        <PgMnt>
          {sections.map((sect) => (
            <MnSect
              key={`${sect.title ?? ''}-${String(sect.isContinuation)}`}
              title={sect.title}
              isContinuation={sect.isContinuation}
              items={sect.items}
            />
          ))}
        </PgMnt>
      </div>
    </MnBrd>
  );
}
