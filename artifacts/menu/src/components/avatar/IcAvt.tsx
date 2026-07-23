import "./avt-bg.css";
import "./IcAvt.css";
import { UplBtn } from "../btn/UplBtn";

interface IcAvtPr {
  src?: string;
  alt?: string;
  shape?: "square" | "circle";
}

export function IcAvt({ src, alt, shape = "square" }: IcAvtPr) {
  const shpCls = `icavt-shp avt-bg${shape === "circle" ? " icavt-shp--cir" : ""}`;
  return (
    <div className="icavt">
      <div className={shpCls}>
        {src
          ? <img src={src} alt={alt || "Menu item"} className="icavt-img" loading="lazy" />
          : <UplBtn />
        }
      </div>
      <div className="icavt-bar" aria-hidden />
    </div>
  );
}
