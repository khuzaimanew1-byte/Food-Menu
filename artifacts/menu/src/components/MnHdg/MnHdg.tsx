import { useId, useState, useEffect } from "react";
import { useEdt } from "@/lib/edt/useEdt";
import "./MnHdg.css";

interface MhPr {
  text?: string;
}

function MnHdg({ text = "Turkish Specialties" }: MhPr) {
  const uid = useId().replace(/:/g, "");
  const isActive = useEdt(text);
  const [editedText, setEditedText] = useState<string | null>(null);

  // Persist edited text on Save
  useEffect(() => {
    const handler = (e: Event) => {
      const d = (e as CustomEvent<{ id: string; fields: Record<string, string> }>).detail;
      if (d?.id !== text) return;
      if (d.fields['title'] !== undefined) setEditedText(d.fields['title']);
    };
    document.addEventListener('edt:save', handler);
    return () => document.removeEventListener('edt:save', handler);
  }, [text]);

  const displayText = editedText ?? text;

  return (
    <div
      className={`mh-wrap flex flex-col items-center${isActive ? " edt-on" : ""}`}
      data-area="section"
      data-id={text}
    >
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

        <h2
          className="mh-ttl ff-s"
          data-edt-field={isActive ? "title" : undefined}
          contentEditable={isActive || undefined}
          suppressContentEditableWarning
        >
          {displayText}
        </h2>

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
