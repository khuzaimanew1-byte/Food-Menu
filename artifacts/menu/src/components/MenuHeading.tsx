import React, { useId } from "react";

interface MenuHeadingProps {
  text?: string;
  showCrown?: boolean;
  size?: string;
}

function MenuHeading({ text = "Turkish Specialties", showCrown = true, size = "28px" }: MenuHeadingProps) {
  const uid = useId().replace(/:/g, "");
  return (
    <div className="menu-heading-container" style={{ fontSize: size }}>
      {showCrown && (
        <svg className="ornament-top" viewBox="0 0 100 40">
          <path d="M50 35 C40 35,30 20,20 20 C10 20,5 30,0 25 M50 35 C60 35,70 20,80 20 C90 20,95 30,100 25" stroke="#d4af37" fill="none" strokeWidth="1.5"/>
          <circle cx="50" cy="15" r="4" fill="#d4af37"/>
          <path d="M43 25 Q50 15 57 25" stroke="#d4af37" fill="none" strokeWidth="1.5"/>
          <path d="M35 15 Q25 5 15 15 T15 25" stroke="#d4af37" fill="none" strokeWidth="1.5"/>
          <path d="M65 15 Q75 5 85 15 T85 25" stroke="#d4af37" fill="none" strokeWidth="1.5"/>
        </svg>
      )}
      <div className="heading-row">
        <div className="divider-line">
          <svg preserveAspectRatio="none" viewBox="0 0 100 10">
            <defs>
              <linearGradient id={`fade-l-${uid}`} x1="0%" x2="100%"><stop offset="0%" stopColor="#fff" stopOpacity="0"/><stop offset="100%" stopColor="#fff" stopOpacity="1"/></linearGradient>
              <mask id={`mask-l-${uid}`}><rect x="0" y="0" width="100" height="10" fill={`url(#fade-l-${uid})`}/></mask>
            </defs>
            <g mask={`url(#mask-l-${uid})`}>
              <line x1="0" y1="5" x2="90" y2="5" stroke="#d4af37" strokeWidth="1"/>
              <polygon points="90,5 95,2 100,5 95,8" fill="#d4af37"/>
              <polygon points="10,5 15,2 20,5 15,8" fill="#d4af37"/>
            </g>
          </svg>
        </div>
        <h2 style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:"1em",letterSpacing:".25em",textTransform:"uppercase",color:"#d4af37",margin:0,textAlign:"center"}}>{text}</h2>
        <div className="divider-line">
          <svg preserveAspectRatio="none" viewBox="0 0 100 10">
            <defs>
              <linearGradient id={`fade-r-${uid}`} x1="0%" x2="100%"><stop offset="0%" stopColor="#fff" stopOpacity="1"/><stop offset="100%" stopColor="#fff" stopOpacity="0"/></linearGradient>
              <mask id={`mask-r-${uid}`}><rect x="0" y="0" width="100" height="10" fill={`url(#fade-r-${uid})`}/></mask>
            </defs>
            <g mask={`url(#mask-r-${uid})`}>
              <polygon points="0,5 5,2 10,5 5,8" fill="#d4af37"/>
              <polygon points="80,5 85,2 90,5 85,8" fill="#d4af37"/>
              <line x1="10" y1="5" x2="100" y2="5" stroke="#d4af37" strokeWidth="1"/>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
export default MenuHeading;