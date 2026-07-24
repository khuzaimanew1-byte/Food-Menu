import "./shape/ic.css";

interface IcBdrPr { children: React.ReactNode; }

export function IcBdr({ children }: IcBdrPr) {
  return (
    <div className="ic-bdr">
      <div className="ic-inn">{children}</div>
      <div className="ic-bar" aria-hidden />
    </div>
  );
}
