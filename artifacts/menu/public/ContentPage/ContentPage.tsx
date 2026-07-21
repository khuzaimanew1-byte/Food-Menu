import React from "react";
import MenuBorder from "../MenuBorder/MenuBorder";
import MenuHeading from "../MenuHeading/MenuHeading";
import { MenuItemCard, MenuItemProps } from "../MenuItemCard/MenuItemCard";
import "./ContentPage.css";

interface ContentPageProps {
  pageNumber: number;
  heading: string;
  items: MenuItemProps[];
  layout: "single" | "two-column";
  showCrown?: boolean;
}

export function ContentPage({ pageNumber, heading, items, layout, showCrown = true }: ContentPageProps) {
  const layoutClass = layout === "two-column" ? "two-col" : "";

  return (
    <MenuBorder pg={pageNumber}>
      <div className={`a4-padding cp-in ${layoutClass}`}>
        <MenuHeading text={heading} showCrown={showCrown} />
        <div className="items-grid cp-grid">
          {items.map(item => (
            <MenuItemCard key={item.id} {...item} />
          ))}
        </div>
      </div>
    </MenuBorder>
  );
}
