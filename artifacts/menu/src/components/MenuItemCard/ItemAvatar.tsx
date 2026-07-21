import React from "react";
import "./ItemAvatar.css";

interface ItemAvatarProps {
  src?: string;
  alt?: string;
}

export function ItemAvatar({ src, alt }: ItemAvatarProps) {
  return (
    <div className="iavt">
      <div className="iavt-in">
        {src && <img src={src} alt={alt || "Menu Item"} className="iavt-img sz-ful" />}
      </div>
    </div>
  );
}
