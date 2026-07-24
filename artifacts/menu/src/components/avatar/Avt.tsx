import "./avt-bg.css";
import "./Avt.css";
import "./shape/sq.css";
import { IcBdr } from "./IcBdr";
import { UplBtn } from "../btn/UplBtn";

type AvtShape = "ic" | "sq";

interface AvtPr {
  src?: string;
  alt?: string;
  shape?: AvtShape;
}

export function Avt({ src, alt, shape = "ic" }: AvtPr) {
  const inner = src
    ? <img src={src} alt={alt || "Menu item"} className="avt-img" loading="lazy" />
    : <UplBtn />;

  return (
    <div className="avt">
      {shape === "ic"
        ? <IcBdr><div className="avt-shp avt-bg">{inner}</div></IcBdr>
        : <div className="avt-shp avt-bg shp-sq">{inner}</div>
      }
      {shape === "ic" && <div className="avt-bar" aria-hidden />}
    </div>
  );
}
