import { memo } from 'react';
import MnHdg               from '../MnHdg/MnHdg';
import { MnItm }           from '../MnItm/MnItm';
import { useMvSect }       from '@/lib/mv/useMv';
import { useMvSectActive } from '@/lib/mv/useMvActive';
import type { MnItem }     from '@/data/menu';
import './MnSect.css';

interface MnSectPr {
  title?:          string;
  isContinuation?: boolean;
  items:           MnItem[];
}

export const MnSect = memo(function MnSect({ title, isContinuation, items }: MnSectPr) {
  const id           = title ?? '';
  const isMoving     = useMvSect(id);
  const mvSectState  = useMvSectActive();
  const isDropTarget = mvSectState.active && !isMoving;

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
      {isContinuation && title !== undefined
        ? <p className="mn-rl ff-s">{title}</p>
        : title !== undefined && <MnHdg text={title} />
      }
      {items.length > 0 && (
        <div className="items-grid cp-grid">
          {items.map(item => (
            <MnItm key={item.id} {...item} />
          ))}
        </div>
      )}
    </div>
  );
});
