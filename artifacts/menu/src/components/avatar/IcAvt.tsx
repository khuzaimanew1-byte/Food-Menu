import "./avt-bg.css";
import "./IcAvt.css";
import "./shape/ic.css";
import "./shape/sq.css";
import { UplBtn } from "../btn/UplBtn";

type AvtShape = "ic" | "sq";

interface IcAvtPr {
  src?: string;
  alt?: string;
  shape?: AvtShape;
}

const shpCls: Record<AvtShape, string> = { ic: "shp-ic", sq: "shp-sq" };

export function IcAvt({ src, alt, shape = "ic" }: IcAvtPr) {
  return (
    <div className="icavt">
      <div className={`icavt-shp avt-bg ${shpCls[shape]}`}>
        {src
          ? <img src={src} alt={alt || "Menu item"} className="icavt-img" loading="lazy" />
          : <UplBtn />
        }
      </div>
      <div className="icavt-bar" aria-hidden />
    </div>
  );
}
