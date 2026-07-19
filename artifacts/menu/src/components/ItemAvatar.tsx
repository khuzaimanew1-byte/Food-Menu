import React from "react";

interface ItemAvatarProps {
  src?: string;
  alt?: string;
}

export function ItemAvatar({ src, alt }: ItemAvatarProps) {
  return (
    <div style={{
      padding: '0.32cqw',
      border: '1px solid rgba(201,167,106,0.55)',
      boxShadow: '0 0.5cqw 1.4cqw rgba(0,0,0,0.55)',
      borderRadius: '2px', // Slight rounding if desired
      background: 'rgba(0,0,0,0.2)',
      flex: '0 0 13.5cqw',
      width: '13.5cqw'
    }}>
      <div style={{
        border: '1px solid rgba(201,167,106,0.28)',
        overflow: 'hidden',
        width: '100%',
        aspectRatio: '4/3',
        backgroundColor: '#211C15',
        borderRadius: '1px',
      }}>
        {src ? (
          <img 
            src={src} 
            alt={alt || "Menu Item"} 
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'sepia(0.22) saturate(1.15) contrast(1.08) brightness(0.92)'
            }} 
          />
        ) : (
          <div style={{ width: '100%', height: '100%', backgroundColor: '#211C15' }} />
        )}
      </div>
    </div>
  );
}
