import { useId } from "react";
import "./MnHdg.css";

interface MhPr {
  text?: string;
  shCrn?: boolean;
}

function MnHdg({ text = "Turkish Specialties", shCrn = true }: MhPr) {
  const uid = useId().replace(/:/g, "");
  return (
    <div className="mh-wrap flex flex-col items-center">
      {shCrn && (
        <svg className="mh-crown" viewBox="0 0 100 40">
          <path d="M50 35 C40 35,30 20,20 20 C10 20,5 30,0 25 M50 35 C60 35,70 20,80 20 C90 20,95 30,100 25" stroke="rgb(var(--gold))" fill="none" strokeWidth="1.5" />
          <circle cx="50" cy="15" r="4" fill="rgb(var(--gold))" />
          <path d="M43 25 Q50 15 57 25"          stroke="rgb(var(--gold))" fill="none" strokeWidth="1.5" />
          <path d="M35 15 Q25 5 15 15 T15 25"    stroke="rgb(var(--gold))" fill="none" strokeWidth="1.5" />
          <path d="M65 15 Q75 5 85 15 T85 25"    stroke="rgb(var(--gold))" fill="none" strokeWidth="1.5" />
        </svg>
      )}
      <div className="mh-row flex items-center justify-center">
        <div className="mh-div">
          <svg preserveAspectRatio="none" viewBox="0 0 100 10">
            <defs>
              <linearGradient id={`fade-l-${uid}`} x1="0%" x2="100%">
                <stop offset="0%"   stopColor="rgb(var(--wht))" stopOpacity="0" />
                <stop offset="100%" stopColor="rgb(var(--wht))" stopOpacity="1" />
              </linearGradient>
              <mask id={`mask-l-${uid}`}><rect x="0" y="0" width="100" height="10" fill={`url(#fade-l-${uid})`} /></mask>
            </defs>
            <g mask={`url(#mask-l-${uid})`}>
              <line    x1="0" y1="5" x2="90" y2="5" stroke="rgb(var(--gold))" strokeWidth="1" />
              <polygon points="90,5 95,2 100,5 95,8" fill="rgb(var(--gold))" />
              <polygon points="10,5 15,2 20,5 15,8" fill="rgb(var(--gold))" />
            </g>
          </svg>
        </div>
        <h2 className="mh-ttl ff-s">{text}</h2>
        <div className="mh-div">
          <svg preserveAspectRatio="none" viewBox="0 0 100 10">
            <defs>
              <linearGradient id={`fade-r-${uid}`} x1="0%" x2="100%">
                <stop offset="0%"   stopColor="rgb(var(--wht))" stopOpacity="1" />
                <stop offset="100%" stopColor="rgb(var(--wht))" stopOpacity="0" />
              </linearGradient>
              <mask id={`mask-r-${uid}`}><rect x="0" y="0" width="100" height="10" fill={`url(#fade-r-${uid})`} /></mask>
            </defs>
            <g mask={`url(#mask-r-${uid})`}>
              <polygon points="0,5 5,2 10,5 5,8"   fill="rgb(var(--gold))" />
              <polygon points="80,5 85,2 90,5 85,8" fill="rgb(var(--gold))" />
              <line    x1="10" y1="5" x2="100" y2="5" stroke="rgb(var(--gold))" strokeWidth="1" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

export default MnHdg;
