import { useState } from "react";
import { Avt } from "../avatar/Avt";
import { EdtBtn } from "../EdtBtn/EdtBtn";
import type { MnItem } from "@/data/menu";
import { useUpld } from "@/lib/upld/useUpld";
import { useImgUpld } from "@/lib/upld/useImgUpld";
import { useEdt } from "@/lib/edt/useEdt";
import "./MnItm.css";

interface MnItmPr extends MnItem {
  /** Avatar shape — drives both the Avt render and mic-avt clip-path. */
  shape?: 'ic' | 'sq' | 'plq';
}

export function MnItm({
  id, name, description, price, image,
  shape = 'ic',
}: MnItmPr) {
  const [sel, setSel] = useState(false);
  const isActive = useEdt(String(id));

  // Object-URL image state — revokes previous URL on each new upload
  const { src: imgSrc, onUpload: handleUpload } = useImgUpld(image);

  // Upload enabled only when this item is in edit mode
  const upld = useUpld({ onUpload: handleUpload, enabled: isActive });

  return (
    <div
      className={`mic-wpr${sel ? " sel" : ""}${isActive ? " edt-on" : ""}`}
      data-area="item"
      data-id={id}
      data-drop-id={isActive ? upld.dropId : undefined}
      onClick={isActive ? undefined : () => setSel((s) => !s)}
    >
      <EdtBtn id={String(id)} type="item" />

      <div className="mic">
        <div
          className="mic-avt"
          data-shape={shape}
          onClick={isActive ? (e) => e.stopPropagation() : undefined}
        >
          <Avt
            src={imgSrc} name={name} alt={name} shape={shape}
            uploadable={isActive}
            onUpload={isActive ? handleUpload : undefined}
            isDragging={isActive ? upld.isDrg : false}
          />

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
            <h3
              className="mic-name ff-s"
              contentEditable={isActive || undefined}
              suppressContentEditableWarning
            >
              {name}
            </h3>
            <div className="mic-lead" />
            <span className="mic-price ff-s">{price}</span>
          </div>
          <p
            className="mic-desc ff-s"
            contentEditable={isActive || undefined}
            suppressContentEditableWarning
          >
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
