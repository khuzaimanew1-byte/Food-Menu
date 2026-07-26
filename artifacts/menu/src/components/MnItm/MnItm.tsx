import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

  // Drop zone for the whole card — disabled when not uploadable.
  // No per-card <input>; upldStore provides the single global file picker.
  const upld = useUpld({ onUpload: handleUpload, enabled: !!uploadable });

  return (
    <div
      className={`mic-wpr${sel ? " sel" : ""}${uploadable && upld.isDrg ? " drop-on" : ""}`}
      data-area="item"
      data-id={id}
      data-drop-id={uploadable ? upld.dropId : undefined}
      onClick={() => setSel((s) => !s)}
    >
      {/* Full-card "Drop here" overlay — only when uploadable and dragging */}
      <AnimatePresence>
        {uploadable && upld.isDrg && (
          <motion.div
            className="mic-drop-ovr"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
          >
            <motion.span
              className="mic-drop-txt ff-s"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.2, ease: "easeOut", delay: 0.04 }}
            >
              Drop here
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mic">
        {/* data-shape and Avt shape prop share the same variable —
            clip-path on mic-avt and avatar render are always in sync. */}
        <div
          className="mic-avt"
          data-shape={shape}
          onClick={uploadable ? (e) => { e.stopPropagation(); upld.pick(); } : undefined}
        >
          <Avt src={imgSrc} name={name} alt={name} shape={shape} />

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
