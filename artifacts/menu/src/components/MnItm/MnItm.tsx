import { useState } from "react";
import { Avt } from "../avatar/Avt";
import { ChkBx } from "../ChkBx/ChkBx";
import type { MnItem } from "@/data/menu";
import "./MnItm.css";

export function MnItm({ name, description, price, image }: MnItem) {
  const [sel, setSel] = useState(false);
  return (
    <div className={`mic${sel ? " sel" : ""}`} onClick={() => setSel(s => !s)}>
      <div className="mic-avt">
        <Avt src={image} alt={name} shape="ic" />
        <div className="mic-chk" aria-hidden>
          <span className="mic-mk">✓</span>
        </div>
      </div>
      <div className="mic-body">
        <div className="mic-row">
          <h3 className="mic-name ff-s">{name}</h3>
          <div className="mic-lead" />
          <span className="mic-price ff-s">{price}</span>
        </div>
        <p className="mic-desc ff-s">{description}</p>
      </div>
      <ChkBx />
    </div>
  );
}
