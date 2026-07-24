import { useState } from 'react';
import './AvtDmo.css';
import { Avt } from '../avatar/Avt';

export function AvtDmo() {
  const [selA, setSelA] = useState(false);
  const [selB, setSelB] = useState(false);
  const [selC, setSelC] = useState(false);
  const [selD, setSelD] = useState(false);

  return (
    <div className="admo">
      <h1 className="admo-ttl ff-s">Avatar Demo</h1>

      <div className="admo-grid">

        {/* ── Normal mode ── */}
        <div className="admo-cell">
          <span className="admo-lbl">Normal · Initials · Idle</span>
          <Avt name="Lamb Kofta" shape="ic" checked={false} onSelect={() => {}} />
        </div>

        <div className="admo-cell">
          <span className="admo-lbl">Normal · Initials · Selected</span>
          <Avt name="Lamb Kofta" shape="ic" checked={selA} onSelect={() => setSelA(s => !s)} />
        </div>

        <div className="admo-cell">
          <span className="admo-lbl">Normal · AV Fallback · Selected</span>
          <Avt shape="ic" checked={selB} onSelect={() => setSelB(s => !s)} />
        </div>

        <div className="admo-cell">
          <span className="admo-lbl">Normal · Sq · Initials · Selected</span>
          <Avt name="Arabic Dish" shape="sq" checked={selC} onSelect={() => setSelC(s => !s)} />
        </div>

        <div className="admo-cell">
          <span className="admo-lbl">Normal · Single-word name</span>
          <Avt name="Kunafa" shape="ic" checked={selD} onSelect={() => setSelD(s => !s)} />
        </div>

        {/* ── Upload mode ── */}
        <div className="admo-cell">
          <span className="admo-lbl">Upload · Empty slot</span>
          <Avt
            name="New Item"
            shape="ic"
            uploadable
            onUpload={(f) => console.log('[AvtDmo] upload', f.name)}
          />
        </div>

        <div className="admo-cell">
          <span className="admo-lbl">Upload · Sq · Empty</span>
          <Avt
            name="New Dish"
            shape="sq"
            uploadable
            onUpload={(f) => console.log('[AvtDmo] upload sq', f.name)}
          />
        </div>

      </div>

      <p className="admo-hint ff-s">
        Normal avatars: click to toggle selection.<br />
        Upload avatars: hover to reveal overlay · drag a file or click to pick.
      </p>
    </div>
  );
}
