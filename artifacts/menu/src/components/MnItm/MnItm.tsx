import { useState } from "react";
import { Avt } from "../avatar/Avt";
import type { MnItem } from "@/data/menu";
import "./MnItm.css";

export function MnItm({ name, description, price, image }: MnItem) {
  const [sel, setSel] = useState(false);
  return (
    <div
      className={`mic${sel ? " sel" : ""}`}
      onClick={() => setSel((s) => !s)}
    >
      <div className="mic-avt">
        <Avt src={image} name={name} alt={name} shape="sq" />
      </div>
      <div className="mic-body">
        <div className="mic-row">
          <h3 className="mic-name ff-s">{name}</h3>
          <div className="mic-lead" />
          <span className="mic-price ff-s">{price}</span>
        </div>
        <p className="mic-desc ff-s">{description}</p>
      </div>
      {/* Check icon lives outside opacity subtree — direct child of .mic */}
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
