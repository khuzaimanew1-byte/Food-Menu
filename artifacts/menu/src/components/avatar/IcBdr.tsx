import "./shape/ic.css";
import "./avt-bg.css";
import "./Avt.css";

interface IcBdrPr { children: React.ReactNode; }

export function IcBdr({ children }: IcBdrPr) {
  return (
    <div className="ic-bdr">
      <div className="avt-shp avt-bg">{children}</div>
      <div className="ic-bar" aria-hidden />
    </div>
  );
}
