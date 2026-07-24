import { useState } from "react";
import { Avt } from "../avatar/Avt";
import type { MnItem } from "@/data/menu";
import "./MnItm.css";

export function MnItm({ name, description, price, image }: MnItem) {
  const [sel, setSel] = useState(false);
  return (
    <div className={`mic${sel ? " sel" : ""}`}>
      <div className="mic-avt">
        <Avt
          src={image}
          name={name}
          alt={name}
          shape="ic"
          checked={sel}
          onSelect={() => setSel(s => !s)}
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
  );
}
