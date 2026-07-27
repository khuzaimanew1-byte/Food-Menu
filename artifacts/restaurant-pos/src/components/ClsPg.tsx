import "./MnBrd/MnBrd.css";

const B = import.meta.env.BASE_URL;

export function ClsPg() {
  return (
    <div className="mb-wrap">
      {/* Background */}
      <img
        src={`${B}img/close.png`}
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

      {/* Top ornament */}
      <img
        src={`${B}img/ornt.png`}
        className="cv-ornt cv-ornt-t"
        aria-hidden="true"
        alt=""
      />

      {/* Bottom ornament — vertically flipped */}
      <img
        src={`${B}img/ornt.png`}
        className="cv-ornt cv-ornt-b"
        aria-hidden="true"
        alt=""
      />
    </div>
  );
}
