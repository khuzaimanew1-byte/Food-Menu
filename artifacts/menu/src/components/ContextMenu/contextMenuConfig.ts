// ─── Types ───────────────────────────────────────────────────────────────────

export type CtxArea = 'item' | 'section' | 'page';

export interface CtxOpt {
  id:        string;
  label:     string;
  icon:      string[];
  danger?:   boolean;
  disabled?: boolean;
}

export interface AreaHit {
  area: CtxArea;
  id:   string | null;
  el:   HTMLElement;
}

// ─── Icon SVG paths (24×24, stroke-based) ────────────────────────────────────

export const ICONS: Record<string, string[]> = {
  edit: [
    'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7',
    'M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z',
  ],
  addItem: [
    'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z',
    'M12 8v8M8 12h8',
  ],
  moveItem: [
    'M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3',
    'M2 12h20M12 2v20',
  ],
  addSection: [
    'M4 6h16M4 11h16M4 16h9',
    'M17 14v6M20 17h-6',
  ],
  assign: [
    'M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z',
    'M7 7h.01',
  ],
  delete: [
    'M3 6h18',
    'M8 6V4h8v2',
    'M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6',
  ],
  moveSection: [
    'M8 9l4-4 4 4',
    'M8 15l4 4 4-4',
    'M12 5v14',
  ],
  layout: [
    'M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z',
  ],
};

// ─── Area → options map ───────────────────────────────────────────────────────

export const MENU_CONFIG: Record<CtxArea, CtxOpt[]> = {
  item: [
    { id: 'edit',         label: 'Edit',         icon: ICONS.edit        },
    { id: 'add-item',     label: '+ Item',        icon: ICONS.addItem     },
    { id: 'move-item',    label: 'Move Item',     icon: ICONS.moveItem    },
    { id: 'add-section',  label: '+ Section',     icon: ICONS.addSection  },
    { id: 'assign',       label: 'Assign',        icon: ICONS.assign      },
    { id: 'delete',       label: 'Delete',        icon: ICONS.delete, danger: true },
  ],
  section: [
    { id: 'edit',         label: 'Edit',          icon: ICONS.edit        },
    { id: 'add-item',     label: '+ Item',        icon: ICONS.addItem     },
    { id: 'move-section', label: 'Move Section',  icon: ICONS.moveSection },
    { id: 'add-section',  label: '+ Section',     icon: ICONS.addSection  },
    { id: 'delete',       label: 'Delete',        icon: ICONS.delete, danger: true },
  ],
  page: [
    { id: 'layout-toggle', label: 'Layout',       icon: ICONS.layout      },
  ],
};

// ─── Area detection ───────────────────────────────────────────────────────────
// Walk up the DOM from `target` and find the nearest element that has
// data-area set to a key defined in MENU_CONFIG.
// Returns AreaHit or null.

export function detectArea(target: EventTarget | null): AreaHit | null {
  let el = target as HTMLElement | null;
  while (el && el !== document.body) {
    const area = el.dataset?.area as CtxArea | undefined;
    if (area && MENU_CONFIG[area]) {
      return { area, id: el.dataset?.id ?? null, el };
    }
    el = el.parentElement;
  }
  return null;
}
