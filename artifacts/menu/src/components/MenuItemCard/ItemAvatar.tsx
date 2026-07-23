import React from "react";
import "./ItemAvatar.css";

interface ItemAvatarProps {
  src?: string;
  alt?: string;
}

export function ItemAvatar({ src, alt }: ItemAvatarProps) {
  return (
    <div className="iavt">
      <div className="iavt-shp">
        {src
          ? <img src={src} alt={alt || "Menu item"} className="iavt-img" />
          : <span className="iavt-ph" aria-hidden>✦</span>
        }
      </div>
      <div className="iavt-bar" aria-hidden />
    </div>
  );
}
