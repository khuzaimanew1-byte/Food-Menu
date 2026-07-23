import { ItAvt } from "./ItAvt";
import { DmBdg } from "../icons/DmBdg";
import type { MnItem } from "@/data/menu";
import "./MnItm.css";

export function MnItm({ id, name, description, price, image }: MnItem) {
  return (
    <div className="mic">
      <div className="mic-avt">
        <ItAvt src={image} alt={name} />
        <div className="mic-bdg">
          <DmBdg num={id} />
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
    </div>
  );
}
