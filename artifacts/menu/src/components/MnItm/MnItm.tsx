import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avt } from "../avatar/Avt";
import type { MnItem } from "@/data/menu";
import { useUpld } from "@/lib/upld/useUpld";
import "./MnItm.css";

interface MnItmPr extends MnItem {
  uploadable?: boolean;
}

export function MnItm({ id, name, description, price, image, uploadable }: MnItmPr) {
  const [sel, setSel] = useState(false);
  const [imgSrc, setImgSrc] = useState<string | undefined>(image);
  const objUrlRef = useRef<string | null>(null);

  const handleUpload = (file: File) => {
    if (objUrlRef.current) URL.revokeObjectURL(objUrlRef.current);
    const url = URL.createObjectURL(file);
    objUrlRef.current = url;
    setImgSrc(url);
  };

  // Drop zone lives on the whole card — disabled when not uploadable so no
  // dead dropReg entry is created for every display-mode item card
  const upld = useUpld({ onUpload: handleUpload, enabled: !!uploadable });

  return (
    /* mic-wpr owns position context, click, AND the drop zone.
       drop-on class cascades down so .drop-on .ic-bdr glow still fires. */
    <div
      className={`mic-wpr${sel ? " sel" : ""}${uploadable && upld.isDrg ? " drop-on" : ""}`}
      data-area="item"
      data-id={id}
      data-drop-id={uploadable ? upld.dropId : undefined}
      onClick={() => setSel((s) => !s)}
    >
      {/* Hidden file input — only mounted when uploadable */}
      {uploadable && (
        <input
          ref={upld.inRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="mic-inp"
          onChange={upld.onInp}
          aria-hidden
          tabIndex={-1}
        />
      )}

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
        {/* Clicking the avatar slot opens the file picker */}
        <div
          className="mic-avt"
          onClick={uploadable ? (e) => { e.stopPropagation(); upld.pick(); } : undefined}
        >
          <Avt
            src={imgSrc}
            name={name}
            alt={name}
            shape="ic"
          />
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

      {/* mic-chk is a sibling of .mic — never inside the opacity subtree */}
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
    </div>
  );
}
