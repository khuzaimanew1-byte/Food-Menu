import "./ItAvt.css";
import { UpIco } from "../icons/UpIco";

interface IaPr {
  src?: string;
  alt?: string;
  size?: string;
}

export function ItAvt({ src, alt, size = "4cqw" }: IaPr) {
  return (
    <div className="iavt">
      <div className="iavt-shp">
        {src ? (
          <img src={src} alt={alt || "Menu item"} className="iavt-img" loading="lazy" />
        ) : (
          <button className="iavt-upl" aria-label="Upload photo">
            <UpIco size={size} />
          </button>
        )}
      </div>
      <div className="iavt-bar" aria-hidden />
    </div>
  );
}
