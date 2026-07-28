---
name: Multi-active edit store
description: edtStore now supports multiple simultaneously active elements (Map<id,type>); outside-click is per-component; price field is editable digits-only; pkFmt is the global number formatter.
---

## The rule
`edtStore` holds a `Map<string, EdtType>` for multi-active; `_dirtyIds: Set<string>` tracks dirty **per element** (NOT global). Confirm modal only fires for the specific ids being deactivated that are dirty — other active elements are unaffected.

**Why:** Section-add must activate section title + default item simultaneously. Per-component outside-click deactivates only the element whose area was clicked outside of.

## How to apply
- `activate(id, type)` — toggles off if already present, adds if not.
- `deactivate(id?)` — removes specific id, or clears all.
- `saveAndDeactivate(id?)` — saves specific or all; dispatches `edt:save` per element.
- `requestDeactivate(ids[])` — checks dirty only for those specific ids; if any dirty → stores as `_pendingIds`, fires `edt:confirm-needed`; else removes only those ids.
- `confirmSave()` / `confirmDiscard()` — operate on `_pendingIds` only, not all active.
- `setDirty(id, v?)` — per-element; components pass their own id. `edtInit._onInput` detects which active element contains the input node.
- `getActive()` returns `{ activeId, activeType, all[] }` — `activeId` = first item-type or first overall (for EdtCnf positioning).
- `useEdt(id)` checks `detail.active.some(a => a.id === id)` on `edt:change`.
- `edtInit` click handler iterates all active elements, collects outside-clicked ids, calls `requestDeactivate(ids)`.
- `EdtCnf` confirm → `confirmSave()` (pending only), close → `confirmDiscard()` (pending only). Enter key → `saveAndDeactivate()` (all active).

## pkFmt — Pakistani number formatter
- Lives in `src/lib/fmt/fmt.ts`. Import `{ pkFmt }` everywhere — never format numbers inline.
- Strips non-numeric prefix (handles legacy "Rs. 12.99"), floors to whole number, applies lakh/crore commas (last 3, then pairs from right).

## MnItm price field
- Default values (`DEF_NAME`, `DEF_DESC`, `DEF_PRICE='000'`) are component-level constants, not in factory.
- `MnItem` fields (`name?`, `description?`, `price?`) are optional; factory `makeItem()` only generates `id`.
- Price display: static `<span class="mic-pfx">Rs.</span>` + `<span class="mic-price" contentEditable>` (digits only via `onInput` filter).
- On edit-mode entry: price span textContent set to raw digits (no commas). On exit: reset to `pkFmt(rawPrice)`.
- `edt:save` strips non-digits from price field before storing.

## Pre-existing TS errors (not caused by this work)
`ContextMenu.tsx` and `actions/index.ts` have 4 pre-existing TS errors: `movingType: 'item'|'section'|null` passed to functions expecting non-null, and React 19 `RefObject` stricter nullability. App runs fine; these predate the multi-active changes.
