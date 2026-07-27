// ── MvLabel — floating label shown while move mode is active ──────────────
import './MvLabel.css';
import { useMvItemActive, useMvSectActive } from '@/lib/mv/useMvActive';
import { getSections } from '@/lib/menu/menuStore';

export function MvLabel() {
  const item = useMvItemActive();
  const sect = useMvSectActive();

  if (!item.active && !sect.active) return null;

  let label = 'Moving…';
  if (item.active && item.movingId) {
    const id = Number(item.movingId);
    for (const s of getSections()) {
      const found = s.items.find(it => it.id === id);
      if (found) { label = `Moving: ${found.name}`; break; }
    }
  } else if (sect.active && sect.movingId) {
    label = `Moving: ${sect.movingId}`;
  }

  return <div className="mv-lbl">{label}</div>;
}
