import React from "react";
import MenuBorder from "./MenuBorder/MenuBorder";
import coverImg from '@assets/Cover_page_1784589382396.png';

export function CoverPage() {
  return (
    <MenuBorder pg={false}>
      <div className="pg-bg">
        <img src={coverImg} alt="Infinity Castle's Cuisine Cover" className="pg-img" />
      </div>
    </MenuBorder>
  );
}
