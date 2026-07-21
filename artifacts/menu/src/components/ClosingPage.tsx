import React from "react";
import MenuBorder from "./MenuBorder/MenuBorder";
import closingImg from '@assets/closing_page_1784589382394.png';

export function ClosingPage() {
  return (
    <MenuBorder pg={false}>
      <div className="pg-bg absolute inset-0">
        <img src={closingImg} alt="Infinity Castle's Cuisine Closing" className="pg-img w-full h-full" />
      </div>
    </MenuBorder>
  );
}
