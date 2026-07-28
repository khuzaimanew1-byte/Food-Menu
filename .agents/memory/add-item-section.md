---
name: Add Item / Add Section Architecture
description: How add-item and add-section actions work end-to-end — factories, store functions, navigation, edit-mode timing.
---

## Full flow

1. User right-clicks → ContextMenu `open()` shows hint icon (before/after) on add-item / add-section options
2. User clicks option → `dispatchCtxAction` → action file
3. Action calls `resolveHint(area, el, x, y, opType)` to get `{ part, targetId }`
4. Action calls the correct menuStore function (addItem / addItemToSection / addSection / appendSection)
5. menuStore dispatches `menu:change` → MnPg re-paginates via `setPages`
6. Action calls `afterAdd(id, type)` from `lib/menu/addBase.ts`
7. `afterAdd`: double-rAF pattern:
   - rAF 1: dispatch `pg:goto` (after React flushes menu:change → setPages)
   - rAF 2: `edtStore.activate(id, type)` (after navigation render completes + new DOM node exists)

## Key files

- `lib/menu/addBase.ts` — `makeItem()`, `makeSection()`, `afterAdd()`
- `lib/menu/menuStore.ts` — `addItem`, `addItemToSection`, `addSection`, `appendSection`
- `lib/spl/splHint.ts` — `resolveHint(area, el, x, y, opType)` — opType renamed from movingType
- `pg/mn-pg/MnPg.tsx` — `pg:goto` listener (uses goToRef pattern so no stale closure); init/destroy useEffect

## Split direction per opType

| opType | direction | note |
|--------|-----------|------|
| 'item' | 'h' horizontal | left = before, right = after |
| 'section' | 'v' vertical | top = before, bottom = after; item area auto-promotes to parent section |

## Hint icons — add vs move

- Move/paste hints: computed inside `if (movingId)` block in `open()`
- Add-item/add-section hints: **separate second pass** after movingId block — always shown regardless of move state
- add-item on section area → NO hint (always append to end)
- add-section on page area → NO hint (always append to end)

## Section title = data-id

`MnSect` uses `title` as both display text and `data-id`. `makeSection()` checks existing titles and increments suffix to guarantee uniqueness (New Section → New Section 2 → …). This matters because `reorderSection` and `addSection` find targets by title.

## Global vs page scope

`initSpl / initEdt / initMv` now called in MnPg's first `useEffect` (no deps).
`destroySpl / destroyEdt / destroyMv` called in cleanup.
`main.tsx` only does `createRoot(...).render(<App />)` — zero init calls.

**Why:** page-specific listeners must not fire on future pages' DOM elements.

## Double-rAF reasoning

Single rAF is not enough: `menu:change` triggers React `setState` which schedules a render. The `pg:goto` must fire AFTER that render so `ttlPg` is updated before `goTo` clamps the page index. The second rAF waits for the navigation render so the new item/section DOM node exists before `edtStore.activate` queries it.
