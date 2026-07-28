// ── anchorPos — reusable element-relative positioning utility ────────────
// Computes top + offsetX for absolutely-positioned panels that appear to the
// right of a containerEl and align vertically with anchorEl.
// Reusable by EdtCnf, tooltip, dropdown, or any anchored overlay.

export interface AnchorPos {
  top:     number | undefined;
  offsetX: number;
}

/**
 * Compute position for a panel that appears to the right of containerEl,
 * vertically centred on anchorEl.
 *
 * @param anchorEl    Element to vertically align with (the active item/section)
 * @param containerEl Positioned parent (position:relative) — panel's offsetParent
 * @param gap         Gap between containerEl right edge and panel  (default 14)
 * @param modalWidth  Estimated panel width for overflow detection  (default 160)
 * @param margin      Min distance from viewport right edge         (default 12)
 */
export function anchorRight(
  anchorEl:    HTMLElement | null,
  containerEl: HTMLElement | null,
  gap         = 14,
  modalWidth  = 160,
  margin      = 12,
): AnchorPos {
  const cRect = containerEl?.getBoundingClientRect();
  const aRect = anchorEl?.getBoundingClientRect();

  const top = cRect && aRect
    ? aRect.top - cRect.top + aRect.height / 2
    : undefined;

  const offsetX = cRect
    ? Math.max(0, cRect.right + gap + modalWidth + margin - window.innerWidth)
    : 0;

  return { top, offsetX };
}
