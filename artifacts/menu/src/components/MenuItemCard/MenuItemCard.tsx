import React from "react";
import { ItemAvatar } from "./ItemAvatar";
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
      <div className="mic-bdg">
        <span className="mic-num">{id}</span>
      </div>
      <ItemAvatar src={image} alt={name} />
      <div className="mic-body">
        <div className="mic-row">
          <h3 className="mic-name">{name}</h3>
          <div className="mic-lead" />
          <span className="mic-price">{price}</span>
        </div>
        <p className="mic-desc">{description}</p>
      </div>
    </div>
  );
}
