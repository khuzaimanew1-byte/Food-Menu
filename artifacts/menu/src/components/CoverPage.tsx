import React from "react";
import MenuBorder from "./MenuBorder/MenuBorder";

export function CoverPage() {
  return (
    <MenuBorder pg={false}>
      <div className="pg-bg absolute inset-0">
        <img src={`${import.meta.env.BASE_URL}img/cover.png`} alt="Infinity Castle's Cuisine Cover" className="pg-img w-full h-full" />
      </div>
    </MenuBorder>
  );
}
