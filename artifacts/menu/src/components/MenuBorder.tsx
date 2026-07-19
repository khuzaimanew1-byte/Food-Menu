import React, { useId, ReactNode } from "react";

interface MenuBorderProps {
  pg?: number | false;
  children?: ReactNode;
}

function MenuBorder({ pg = 1, children }: MenuBorderProps) {
  const uid = useId().replace(/:/g, "");
  const cornerId = `corner-tl-${uid}`;
  const formattedNumber = pg !== false ? String(pg).padStart(2, "0") : null;

  return (
    <div className="menu-container" style={{ position:"relative",width:"100%",maxWidth:"1054px",aspectRatio:"1054 / 1492",backgroundColor:"#1c1c1c",boxShadow:"0 0 50px rgba(0,0,0,0.8)",overflow:"hidden" }}>
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-[10]" style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:10}} viewBox="0 0 1054 1492" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <style>{`
            .gold-stroke { stroke:#d4af37; fill:none; stroke-linecap:square; stroke-linejoin:miter; }
            .gold-fill { fill:#d4af37; }
            .hairline { stroke-width:1; }
            .thin { stroke-width:2; }
            .thick { stroke-width:4; }
          `}</style>
          <g id={cornerId}>
            <polyline className="gold-stroke hairline" points="45,115 45,45 115,45"/>
            <rect className="gold-fill" height="4" width="4" x="43" y="118"/>
            <rect className="gold-fill" height="4" width="4" x="118" y="43"/>
            <line className="gold-stroke thin" x1="35" x2="35" y1="35" y2="125"/>
            <line className="gold-stroke thin" x1="35" x2="125" y1="35" y2="35"/>
            <line className="gold-stroke thin" x1="25" x2="25" y1="25" y2="135"/>
            <line className="gold-stroke thin" x1="25" x2="135" y1="25" y2="25"/>
            <line className="gold-stroke hairline" x1="15" x2="15" y1="15" y2="145"/>
            <line className="gold-stroke hairline" x1="15" x2="145" y1="15" y2="15"/>
            <rect className="gold-stroke thin" height="30" width="30" x="55" y="55"/>
            <rect className="gold-stroke hairline" height="14" width="14" x="63" y="63"/>
            <rect className="gold-fill" height="4" width="4" x="68" y="68"/>
            <polyline className="gold-stroke hairline" points="95,55 95,95 55,95"/>
            <rect className="gold-fill" height="3" width="3" x="93.5" y="50"/>
            <rect className="gold-fill" height="3" width="3" x="50" y="93.5"/>
          </g>
        </defs>
        <rect className="gold-stroke hairline" height="1472" width="1034" x="10" y="10"/>
        <rect className="gold-stroke thin" height="1432" width="994" x="30" y="30"/>
        <use href={`#${cornerId}`} x="0" y="0"/>
        <use href={`#${cornerId}`} transform="translate(1054,0) scale(-1,1)" x="0" y="0"/>
        <use href={`#${cornerId}`} transform="translate(0,1492) scale(1,-1)" x="0" y="0"/>
        <use href={`#${cornerId}`} transform="translate(1054,1492) scale(-1,-1)" x="0" y="0"/>
        {formattedNumber !== null && (
          <g transform="translate(527,1422)">
            <path className="gold-stroke thin" d="M 0,-40 C 25,-40 35,-20 45,0 C 35,20 25,40 0,40 C -25,40 -35,20 -45,0 C -35,-20 -25,-40 0,-40 Z"/>
            <path className="gold-stroke hairline" d="M 0,-30 C 15,-30 25,-15 33,0 C 25,15 15,30 0,30 C -15,30 -25,15 -33,0 C -25,-15 -15,-30 0,-30 Z"/>
            <text x="0" y="1" textAnchor="middle" dominantBaseline="middle" fontFamily="'Playfair Display',serif" fontWeight="700" fontSize="22" fill="#d4af37" letterSpacing="1">{formattedNumber}</text>
            <line className="gold-stroke thin" x1="-45" x2="-230" y1="0" y2="0"/>
            <circle className="gold-fill" cx="-52" cy="0" r="2.5"/>
            <circle className="gold-fill" cx="-240" cy="0" r="3"/>
            <path className="gold-stroke thin" d="M -240,-10 L -250,0 L -240,10 L -230,0 Z"/>
            <line className="gold-stroke thin" x1="45" x2="230" y1="0" y2="0"/>
            <circle className="gold-fill" cx="52" cy="0" r="2.5"/>
            <circle className="gold-fill" cx="240" cy="0" r="3"/>
            <path className="gold-stroke thin" d="M 240,-10 L 250,0 L 240,10 L 230,0 Z"/>
          </g>
        )}
      </svg>
      <div className="relative z-10 w-full h-full flex flex-col">
        {children}
      </div>
    </div>
  );
}
export default MenuBorder;