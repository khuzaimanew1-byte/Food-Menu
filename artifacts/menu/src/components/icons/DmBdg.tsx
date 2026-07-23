import "./DmBdg.css";

interface DbPr { num?: number | string; }

export function DmBdg({ num }: DbPr) {
  return (
    <div className="dmbdg glass" aria-hidden={num === undefined ? true : undefined}>
      {num !== undefined && <span className="dmbdg-num ff-s">{num}</span>}
    </div>
  );
}
