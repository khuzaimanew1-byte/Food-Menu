import React from "react";
import MenuBorder from "./MenuBorder";
import coverImg from '@assets/Cover_page_1784457716080.png';

export function CoverPage() {
  return (
    <MenuBorder pg={false}>
      <div style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, zIndex: -1 }}>
        <img 
          src={coverImg} 
          alt="Infinity Castle's Cuisine Cover" 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
      </div>
    </MenuBorder>
  );
}
