import React from "react";
import MenuBorder from "./MenuBorder/MenuBorder";
import "./ClosingPage.css";

export function ClosingPage() {
  return (
    <MenuBorder pg={false}>
      <div className="cls-bg">
        <div className="cls-inner a4-padding">
          <div className="cls-ornament">
            <svg viewBox="0 0 200 20" className="cls-rule">
              <line x1="0" y1="10" x2="70" y2="10" stroke="var(--gold)" strokeWidth="0.8" opacity="0.6"/>
              <polygon points="70,10 76,7 82,10 76,13" fill="var(--gold)"/>
              <circle cx="100" cy="10" r="4" fill="none" stroke="var(--gold)" strokeWidth="1"/>
              <circle cx="100" cy="10" r="1.5" fill="var(--gold)"/>
              <polygon points="118,10 124,7 130,10 124,13" fill="var(--gold)" transform="scale(-1,1) translate(-200,0)"/>
              <line x1="130" y1="10" x2="200" y2="10" stroke="var(--gold)" strokeWidth="0.8" opacity="0.6"/>
            </svg>
          </div>

          <h2 className="cls-title">Thank You</h2>

          <div className="cls-ornament">
            <svg viewBox="0 0 200 20" className="cls-rule">
              <line x1="0" y1="10" x2="200" y2="10" stroke="var(--gold)" strokeWidth="0.5" opacity="0.3"/>
            </svg>
          </div>

          <p className="cls-body">
            We are grateful for your visit.<br/>
            Every dish is crafted with care, tradition,<br/>
            and a passion for authentic flavour.
          </p>

          <div className="cls-ornament" style={{marginTop: "4cqw"}}>
            <svg viewBox="0 0 60 30" className="cls-emblem">
              <path d="M30 2 L34 12 L44 12 L36 18 L39 28 L30 22 L21 28 L24 18 L16 12 L26 12 Z"
                    fill="none" stroke="var(--gold)" strokeWidth="0.8" opacity="0.6"/>
              <path d="M30 7 L32.5 14 L40 14 L34 18.5 L36.5 26 L30 21.5 L23.5 26 L26 18.5 L20 14 L27.5 14 Z"
                    fill="var(--gold)" opacity="0.15"/>
            </svg>
          </div>

          <p className="cls-name">Infinity Castle's Cuisine</p>

          <div className="cls-ornament" style={{marginTop: "2cqw"}}>
            <svg viewBox="0 0 200 20" className="cls-rule">
              <line x1="0" y1="10" x2="70" y2="10" stroke="var(--gold)" strokeWidth="0.8" opacity="0.6"/>
              <polygon points="70,10 76,7 82,10 76,13" fill="var(--gold)"/>
              <circle cx="100" cy="10" r="4" fill="none" stroke="var(--gold)" strokeWidth="1"/>
              <circle cx="100" cy="10" r="1.5" fill="var(--gold)"/>
              <polygon points="118,10 124,7 130,10 124,13" fill="var(--gold)" transform="scale(-1,1) translate(-200,0)"/>
              <line x1="130" y1="10" x2="200" y2="10" stroke="var(--gold)" strokeWidth="0.8" opacity="0.6"/>
            </svg>
          </div>

          <p className="cls-contact">
            Reservations &amp; Enquiries<br/>
            <span className="cls-contact-detail">+1 (800) CASTLE · info@infinitycastle.com</span>
          </p>
        </div>
      </div>
    </MenuBorder>
  );
}
