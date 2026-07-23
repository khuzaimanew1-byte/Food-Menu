import "./ItAvt.css";
import { UpIco } from "../icons/UpIco";

interface IaPr {
  src?: string;
  alt?: string;
}

export function ItAvt({ src, alt }: IaPr) {
  return (
    <div className="iavt">
      <div className="iavt-shp bg-dk">
        {src ? (
          <img src={src} alt={alt || "Menu item"} className="iavt-img" loading="lazy" />
        ) : (
          <button className="iavt-upl" aria-label="Upload photo">
            <UpIco />
          </button>
        )}
      </div>
      <div className="iavt-bar" aria-hidden />
    </div>
  );
}
