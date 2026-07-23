import React from "react";
import "../Button/base.css";
import "../Button/icon-only.css";
import "./ItemAvatar.css";

interface ItemAvatarProps {
  src?: string;
  alt?: string;
}

export function ItemAvatar({ src, alt }: ItemAvatarProps) {
  return (
    <div className="iavt">
      <div className="iavt-shp">
        {src ? (
          <img src={src} alt={alt || "Menu item"} className="iavt-img" />
        ) : (
          <button
            className="btn btio rounded-full w-[4cqw] h-[4cqw]"
            aria-label="Upload photo"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-full h-full"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M12 15V7" />
              <path d="M9 10l3-3 3 3" />
              <path d="M5 19h14" />
            </svg>
          </button>
        )}
      </div>
      <div className="iavt-bar" aria-hidden />
    </div>
  );
}
