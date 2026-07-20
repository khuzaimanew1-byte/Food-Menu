import React from "react";
import MenuBorder from "./MenuBorder/MenuBorder";
import "./CoverPage.css";

export function CoverPage() {
  return (
    <MenuBorder pg={false}>
      <div className="cvr-bg">
        <div className="cvr-inner a4-padding">
          <div className="cvr-ornament">
            <svg viewBox="0 0 200 20" className="cvr-rule">
              <line x1="0" y1="10" x2="70" y2="10" stroke="var(--gold)" strokeWidth="0.8" opacity="0.6"/>
              <polygon points="70,10 76,7 82,10 76,13" fill="var(--gold)"/>
              <circle cx="100" cy="10" r="4" fill="none" stroke="var(--gold)" strokeWidth="1"/>
              <circle cx="100" cy="10" r="1.5" fill="var(--gold)"/>
              <polygon points="118,10 124,7 130,10 124,13" fill="var(--gold)" transform="scale(-1,1) translate(-200,0)"/>
              <line x1="130" y1="10" x2="200" y2="10" stroke="var(--gold)" strokeWidth="0.8" opacity="0.6"/>
            </svg>
          </div>

          <p className="cvr-est">Est. 2024</p>

          <div className="cvr-ornament">
            <svg viewBox="0 0 60 60" className="cvr-crest">
              <circle cx="30" cy="30" r="28" fill="none" stroke="var(--gold)" strokeWidth="0.8" opacity="0.4"/>
              <circle cx="30" cy="30" r="22" fill="none" stroke="var(--gold)" strokeWidth="0.5" opacity="0.3"/>
              <path d="M30 10 C20 10,12 18,12 30 C12 42,20 50,30 50 C40 50,48 42,48 30 C48 18,40 10,30 10 Z"
                    fill="none" stroke="var(--gold)" strokeWidth="0.6" opacity="0.25"/>
              <path d="M30 2 L32 28 L30 32 L28 28 Z" fill="var(--gold)" opacity="0.7"/>
              <path d="M30 58 L32 32 L30 28 L28 32 Z" fill="var(--gold)" opacity="0.7"/>
              <path d="M2 30 L28 32 L32 30 L28 28 Z" fill="var(--gold)" opacity="0.7"/>
              <path d="M58 30 L32 28 L28 30 L32 32 Z" fill="var(--gold)" opacity="0.7"/>
              <circle cx="30" cy="30" r="5" fill="none" stroke="var(--gold)" strokeWidth="1"/>
              <circle cx="30" cy="30" r="2" fill="var(--gold)"/>
            </svg>
          </div>

          <h1 className="cvr-name">Infinity Castle's</h1>
          <h2 className="cvr-sub">Cuisine</h2>

          <div className="cvr-ornament" style={{marginTop: "2cqw"}}>
            <svg viewBox="0 0 200 20" className="cvr-rule">
              <line x1="0" y1="10" x2="70" y2="10" stroke="var(--gold)" strokeWidth="0.8" opacity="0.6"/>
              <polygon points="70,10 76,7 82,10 76,13" fill="var(--gold)"/>
              <circle cx="100" cy="10" r="4" fill="none" stroke="var(--gold)" strokeWidth="1"/>
              <circle cx="100" cy="10" r="1.5" fill="var(--gold)"/>
              <polygon points="118,10 124,7 130,10 124,13" fill="var(--gold)" transform="scale(-1,1) translate(-200,0)"/>
              <line x1="130" y1="10" x2="200" y2="10" stroke="var(--gold)" strokeWidth="0.8" opacity="0.6"/>
            </svg>
          </div>

          <p className="cvr-tagline">Arabic &amp; Turkish Specialties</p>
        </div>
      </div>
    </MenuBorder>
  );
}
