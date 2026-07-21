import React from "react";
import MenuBorder from "./MenuBorder/MenuBorder";

export function ClosingPage() {
  return (
    <MenuBorder pg={false}>
      <div className="pg-bg absolute inset-0">
        <img src={`${import.meta.env.BASE_URL}img/close.png`} alt="Infinity Castle's Cuisine Closing" className="pg-img w-full h-full" />
      </div>
    </MenuBorder>
  );
}
