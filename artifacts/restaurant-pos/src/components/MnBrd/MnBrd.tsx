import { memo, type ReactNode } from "react";
import "./MnBrd.css";

interface MbPr {
  pg?: number | false;
  children?: ReactNode;
}

const B = import.meta.env.BASE_URL;

const MnBrd = memo(function MnBrd({ pg = 1, children }: MbPr) {
  const pgNum = pg !== false ? String(pg).padStart(2, "0") : null;

  return (
    <div className="mb-wrap" data-area="page" data-id={pg === false ? undefined : pg}>
      <img src={`${B}img/pgbg.png`} className="mb-bg" aria-hidden="true" alt="" />
      <div className="mb-ovr dkgl" aria-hidden="true" />
      <div className="mb-body flex flex-col w-full h-full">{children}</div>
      <img src={`${B}img/brd.png`} className="mb-brd" aria-hidden="true" alt="" />
      <img src={`${B}img/ornt.png`} className="cv-ornt cv-ornt-t" aria-hidden="true" alt="" />
      {pgNum !== null && (
        <div className="mb-pgn-wrap" aria-hidden="true">
          <img src={`${B}img/pgorn.png`} className="mb-pgn-ornt" alt="" />
          <span className="mb-pgn ff-c">{pgNum}</span>
        </div>
      )}
    </div>
  );
});

export default MnBrd;
