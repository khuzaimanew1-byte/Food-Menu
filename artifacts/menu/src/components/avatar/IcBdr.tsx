import './shape/ic.css';

interface IcBdrPr {
  children: React.ReactNode;
  ovr?: React.ReactNode;
}

export function IcBdr({ children, ovr }: IcBdrPr) {
  return (
    <div className="ic-bdr">
      <div className="ic-inn">
        {children}
        {ovr}
      </div>
      <div className="ic-bar" aria-hidden />
    </div>
  );
}
