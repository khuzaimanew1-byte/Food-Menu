import "./avt-bg.css";
import "./IcAvt.css";
import "./shape/sq.css";
import { IcBdr } from "./IcBdr";
import { UplBtn } from "../btn/UplBtn";

type AvtShape = "ic" | "sq";

interface IcAvtPr {
  src?: string;
  alt?: string;
  shape?: AvtShape;
}

export function IcAvt({ src, alt, shape = "ic" }: IcAvtPr) {
  const inner = src
    ? <img src={src} alt={alt || "Menu item"} className="icavt-img" loading="lazy" />
    : <UplBtn />;

  return (
    <div className="icavt">
      {shape === "ic"
        ? <IcBdr><div className="icavt-shp avt-bg">{inner}</div></IcBdr>
        : <div className="icavt-shp avt-bg shp-sq">{inner}</div>
      }
      {shape === "ic" && <div className="icavt-bar" aria-hidden />}
    </div>
  );
}
