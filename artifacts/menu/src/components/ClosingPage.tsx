import React from "react";
import MenuBorder from "./MenuBorder";
import closingImg from '@assets/closing_page_1784457723685.png';

export function ClosingPage() {
  return (
    <MenuBorder pg={false}>
      <div style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, zIndex: -1 }}>
        <img 
          src={closingImg} 
          alt="Infinity Castle's Cuisine Closing" 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
      </div>
    </MenuBorder>
  );
}
