// ─── Types ───────────────────────────────────────────────────────────────────

export type CtxArea = 'item' | 'section' | 'page';

export interface CtxOpt {
  id:         string;
  label:      string;
  icon:       string[];
  danger?:    boolean;
  disabled?:  boolean;
  separator?: boolean;   // render a rule above this option
  children?:  CtxOpt[];  // if set, renders a flyout submenu instead of firing onSelect
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
  cancelMove: [
    'M18 6L6 18M6 6l12 12',
  ],
  shapes: [
    'M12 2L2 7l10 5 10-5-10-5z',
    'M2 17l10 5 10-5',
    'M2 12l10 5 10-5',
  ],
  square: [
    'M3 3h18v18H3z',
  ],
  infCastle: [
    'M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.133-8-12.739-8-4.585 0-4.585 8 0 8 5.606 0 7.644-8 12.74-8z',
  ],
  plaque: [
    'M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z',
    'M8 10h8M8 14h5',
  ],
};

// ─── Shared move options — single definition, referenced in both areas ────────

const OPT_MOVE_ITEM:    CtxOpt = { id: 'move-item',    label: 'Move Item',    icon: ICONS.moveItem    };
const OPT_MOVE_SECTION: CtxOpt = { id: 'move-section', label: 'Move Section', icon: ICONS.moveSection };

// ─── Area → options map ───────────────────────────────────────────────────────

export const MENU_CONFIG: Record<CtxArea, CtxOpt[]> = {
  item: [
    { id: 'edit',        label: 'Edit',        icon: ICONS.edit                                       },
    { id: 'assign',      label: 'Assign',      icon: ICONS.assign                                     },
    { id: 'add-item',    label: 'Add Item',    icon: ICONS.addItem                                    },
    OPT_MOVE_ITEM,
    OPT_MOVE_SECTION,
    { id: 'add-section', label: 'Add Section', icon: ICONS.addSection                                 },
    { id: 'delete',      label: 'Delete',      icon: ICONS.delete, danger: true, separator: true      },
  ],
  section: [
    { id: 'edit',        label: 'Edit',        icon: ICONS.edit                                       },
    { id: 'add-item',    label: 'Add Item',    icon: ICONS.addItem                                    },
    OPT_MOVE_ITEM,
    OPT_MOVE_SECTION,
    { id: 'add-section', label: 'Add Section', icon: ICONS.addSection                                 },
    { id: 'delete',      label: 'Delete',      icon: ICONS.delete, danger: true, separator: true      },
  ],
  page: [
    { id: 'add-section', label: 'Add Section', icon: ICONS.addSection },
    {
      id: 'shapes', label: 'Shapes', icon: ICONS.shapes, separator: true,
      children: [
        { id: 'shape-sq',  label: 'Square',          icon: ICONS.square    },
        { id: 'shape-inf', label: 'Infinity Castle',  icon: ICONS.infCastle },
        { id: 'shape-plq', label: 'Plaque',           icon: ICONS.plaque    },
      ],
    },
  ],
};

// ─── Area detection ───────────────────────────────────────────────────────────

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
