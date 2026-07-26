import { useState, useEffect } from "react";
import { Avt } from "../avatar/Avt";
import { restoreImgSrc } from "@/lib/upld/upld";
import type { MnItem } from "@/data/menu";
import "./MnItm.css";

interface MnItmPr extends MnItem {
  shape?: 'ic' | 'sq' | 'plq';
}

export function MnItm({
  id, name, description, price,
  shape = 'ic',
}: MnItmPr) {
  const [sel, setSel] = useState(false);

  // Restore uploaded image after page remount (AnimatePresence unmounts/remounts
  // pages on navigation, which destroys the old img element; the objUrls Map
  // still holds the URL so we re-apply it once the new img is in the DOM).
  useEffect(() => {
    restoreImgSrc(String(id));
  }, [id]);

  return (
    <div
      className={`mic-wpr${sel ? " sel" : ""}`}
      data-item-id={id}
      onClick={() => setSel((s) => !s)}
    >
      <div className="mic">
        <div
          className="mic-avt"
          data-shape={shape}
          // In edit mode: stop selection toggle when clicking the avatar area.
          // Native event still bubbles to document where global click delegation
          // calls upldStore.pick(). Purely DOM check — no hook, no prop.
          onClick={(e) => { if (document.querySelector('.edit-mode')) e.stopPropagation(); }}
        >
          <Avt id={String(id)} name={name} alt={name} shape={shape} />

          {/* Checkmark overlay — only for ic shape */}
          {shape === 'ic' && (
            <div className="mic-chk" aria-hidden>
              <svg className="mic-mk" viewBox="0 0 24 24" fill="none" aria-hidden>
                <polyline
                  points="20 6 9 17 4 12"
                  stroke="currentColor"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}
        </div>

        <div className="mic-body">
          <div className="mic-row">
            <h3 className="mic-name ff-s">{name}</h3>
            <div className="mic-lead" />
            <span className="mic-price ff-s">{price}</span>
          </div>
          <p className="mic-desc ff-s">{description}</p>
        </div>
      </div>
    </div>
  );
}
