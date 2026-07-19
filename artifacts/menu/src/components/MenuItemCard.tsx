import React from "react";
import { ItemAvatar } from "./ItemAvatar";

export interface MenuItemProps {
  id: number;
  name: string;
  description: string;
  price: string;
  image?: string;
}

export function MenuItemCard({ id, name, description, price, image }: MenuItemProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '2.2cqw',
      paddingBlock: '2.5cqw',
      borderBottom: '1px solid rgba(201,167,106,0.05)'
    }}>
      {/* Number badge */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '3.8cqw',
        height: '3.8cqw',
        border: '1.3px solid #C9A76A',
        background: 'linear-gradient(135deg, rgba(201,167,106,0.14), rgba(201,167,106,0.02))',
        transform: 'rotate(45deg)',
        flexShrink: 0
      }}>
        <span style={{
          transform: 'rotate(-45deg)',
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 600,
          fontSize: 'clamp(10px, 1.6cqw, 14px)',
          color: '#EDD9AC',
          lineHeight: 1
        }}>
          {id}
        </span>
      </div>

      <ItemAvatar src={image} alt={name} />

      <div style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', gap: '0.7cqw' }}>
        <div style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: '1.2cqw'
        }}>
          <h3 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 600,
            textTransform: 'uppercase',
            fontSize: 'clamp(12px, 2.15cqw, 19px)',
            letterSpacing: '0.06em',
            color: '#F8F2E3',
            margin: 0
          }}>
            {name}
          </h3>
          
          <div style={{
            flex: '1 1 0',
            height: '1px',
            background: 'linear-gradient(to right, rgba(201,167,106,0.5), rgba(201,167,106,0.08))'
          }} />
          
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 700,
            fontStyle: 'italic',
            fontSize: 'clamp(12px, 1.95cqw, 17px)',
            backgroundImage: 'linear-gradient(180deg, #F3DFA8 0%, #C9A15A 55%, #E6C583 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            color: '#C9A15A', // Fallback
            whiteSpace: 'nowrap'
          }}>
            {price}
          </span>
        </div>
        
        <p style={{
          fontFamily: "'Jost', sans-serif",
          fontWeight: 300,
          fontSize: 'clamp(9px, 1.5cqw, 13px)',
          lineHeight: 1.6,
          color: '#ABA08D',
          margin: 0,
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical' as const,
        }}>
          {description}
        </p>
      </div>
    </div>
  );
}
