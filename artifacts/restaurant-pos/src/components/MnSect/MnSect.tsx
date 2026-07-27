// ── MnSect — section container ─────────────────────────────────────────────
// Single source of truth for a menu section. Owns data-area="section" on its
// root so the whole unit (heading + items) is the context-menu and move target.
// MnHdg is purely presentational; move / disabled state lives here.

import MnHdg           from '../MnHdg/MnHdg';
import { MnItm }       from '../MnItm/MnItm';
import { useMv }       from '@/lib/mv/useMv';
import { useMvActive } from '@/lib/mv/useMvActive';
import type { MnItem } from '@/data/menu';
import './MnSect.css';

interface MnSectPr {
  title?: string;
  items:  MnItem[];
}

export function MnSect({ title, items }: MnSectPr) {
  const id           = title ?? '';
  const isMoving     = useMv(id);
  const mvState      = useMvActive();
  const isDropTarget = mvState.active && mvState.movingType === 'section' && !isMoving;

  const cls = [
    'mn-sect',
    isMoving     ? 'disabled'  : '',
    isDropTarget ? 'mv-target' : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      className={cls}
      data-area={title !== undefined ? 'section' : undefined}
      data-id={title !== undefined ? title : undefined}
    >
      {title !== undefined && <MnHdg text={title} />}
      {items.length > 0 && (
        <div className="items-grid cp-grid">
          {items.map(item => (
            <MnItm key={item.id} {...item} />
          ))}
        </div>
      )}
    </div>
  );
}
