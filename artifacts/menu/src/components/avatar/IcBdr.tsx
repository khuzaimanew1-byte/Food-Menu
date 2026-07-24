import "./shape/ic.css";

interface IcBdrPr { children: React.ReactNode; }

export function IcBdr({ children }: IcBdrPr) {
  return <div className="ic-bdr">{children}</div>;
}
