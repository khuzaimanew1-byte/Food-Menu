import "./MnBrd/MnBrd.css";

const B = import.meta.env.BASE_URL;

export function CvrPg() {
  return (
    <div className="mb-wrap">
      {/* Background */}
      <img
        src={`${B}img/cover.png`}
        className="mb-bg"
        aria-hidden="true"
        alt=""
      />

      {/* Border frame */}
      <img
        src={`${B}img/brd.png`}
        className="mb-brd"
        aria-hidden="true"
        alt=""
      />

      {/* Top ornament — centered on the top border edge */}
      <img
        src={`${B}img/ornt.png`}
        className="mb-ornt mb-ornt-t"
        aria-hidden="true"
        alt=""
      />

      {/* Bottom ornament — vertically flipped, centered on the bottom border edge */}
      <img
        src={`${B}img/ornt.png`}
        className="mb-ornt mb-ornt-b"
        aria-hidden="true"
        alt=""
      />
    </div>
  );
}
