import React from "react";
import MenuBorder from "./MenuBorder/MenuBorder";
import closingImg from '@assets/closing_page_1784589382394.png';

export function ClosingPage() {
  return (
    <MenuBorder pg={false}>
      <div className="pg-bg">
        <img src={closingImg} alt="Infinity Castle's Cuisine Closing" className="pg-img" />
      </div>
    </MenuBorder>
  );
}
