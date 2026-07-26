import { useState } from "react";
import { Avt } from "../avatar/Avt";
import type { MnItem } from "@/data/menu";
import { useUpld } from "@/lib/upld/useUpld";
import { useImgUpld } from "@/lib/upld/useImgUpld";
import "./MnItm.css";

interface MnItmPr extends MnItem {
  uploadable?: boolean;
  /** Avatar shape — drives both the Avt render and mic-avt clip-path.
   *  Must be kept in sync: changing shape here changes both automatically. */
  shape?: 'ic' | 'sq' | 'plq';
}

export function MnItm({
  id, name, description, price, image,
  uploadable,
  shape = 'ic',
}: MnItmPr) {
  const [sel, setSel] = useState(false);

  // Object-URL image state — revokes previous URL on each new upload
  const { src: imgSrc, onUpload: handleUpload } = useImgUpld(image);

  // Card-level drop zone — covers the whole item, not just the avatar.
  // isDrg is forwarded to Avt so the avatar highlights even when the drag
  // cursor is over the text/price area of the card.
  const upld = useUpld({ onUpload: handleUpload, enabled: !!uploadable });

  return (
    <div
      className={`mic-wpr${sel ? " sel" : ""}`}
      data-area="item"
      data-id={id}
      data-drop-id={uploadable ? upld.dropId : undefined}
      onClick={() => setSel((s) => !s)}
    >
      <div className="mic">
        <div
          className="mic-avt"
          data-shape={shape}
          onClick={uploadable ? (e) => e.stopPropagation() : undefined}
        >
          <Avt
            src={imgSrc} name={name} alt={name} shape={shape}
            uploadable={uploadable}
            onUpload={uploadable ? handleUpload : undefined}
            isDragging={uploadable ? upld.isDrg : false}
          />

          {/* Checkmark overlay — only for ic shape (clip-path is the polygon) */}
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
