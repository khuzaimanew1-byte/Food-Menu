import React from "react";
import MenuBorder from "./MenuBorder";
import MenuHeading from "./MenuHeading";
import { MenuItemCard, MenuItemProps } from "./MenuItemCard";

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
      <div className={`a4-padding ${layoutClass}`} style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <MenuHeading text={heading} showCrown={showCrown} />
        
        <div className="items-grid" style={{ flex: 1, alignContent: 'start' }}>
          {items.map(item => (
            <MenuItemCard key={item.id} {...item} />
          ))}
        </div>
      </div>
    </MenuBorder>
  );
}
