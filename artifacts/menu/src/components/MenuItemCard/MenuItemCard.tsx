import React from "react";
import { ItemAvatar } from "./ItemAvatar";
import { DiamondBadge } from "../icons/DiamondBadge";
import "./MenuItemCard.css";

export interface MenuItemProps {
  id: number;
  name: string;
  description: string;
  price: string;
  image?: string;
}

export function MenuItemCard({ id, name, description, price, image }: MenuItemProps) {
  return (
    <div className="mic">
      <div className="mic-avt">
        <ItemAvatar src={image} alt={name} />
        <div className="mic-bdg">
          <DiamondBadge num={id} />
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
