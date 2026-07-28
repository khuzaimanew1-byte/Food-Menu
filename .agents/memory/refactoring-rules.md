---
name: Refactoring rules — applied patterns
description: SSOT-Rules REFACTORING section violations found and how they were fixed; patterns to watch for on future tasks.
---

# Refactoring Rules — Applied Patterns

**Why:** This project has strict SSOT-Rules.md enforced on every task. The REFACTORING section violations recur and must be pre-checked before any edit.

## Recurring violation types found

### [NO-LOG]
- `console.log` and `console.warn` appear in stub action files (ContextMenu/actions/*) when devs add placeholders. Always grep before declaring clean.
- `console.error` only allowed for genuine runtime errors.

### [NO-DEAD]
- External SSoT files exist alongside inline duplicates: `menuPos.ts` (calcPos/calcSubPos + constants), `pgVars.ts` (animation variants), `rndPg.tsx` (page render fn) — all had inline copies inside ContextMenu.tsx and MnPg.tsx. Import from these files; never inline.
- `AvtOvr` component was exported but never imported anywhere — fully dead.
- CSS classes `.mb-ornt`/`.mb-ornt-t` existed in MnBrd.css with no TSX usage.
- Commented-out CSS (`/* width: 100%; */`) must be removed immediately.

### [CSS-NOHARD]
- Danger palette needed two new vars added to variables.css: `--dnga: 204, 75, 55` and `--dngb: 180, 55, 38` (distinct from existing `--dng`/`--dngh`).
- Always check `variables.css` for an existing var before adding a new one.
- `--ctx: 10, 8, 7` covers the dark panel background; `--blk: 0, 0, 0` covers pure black overlays; `--wht: 255, 255, 255` covers white text.

### [LIST-KEY]
- SVG `<path>` elements rendered from arrays used index keys. Fix: use `key={d}` (the path `d` attribute is unique per icon path array).
- `CtntPg` section keys used `title-index` pattern. Fix: `${sect.title ?? ''}-${String(sect.isContinuation)}`.

### [MEMO-HEAVY]
- Pure render components MnSect, MnHdg, MnBrd, OptRow (DropdownPanel), PgMnt (CtntPg) all lacked `React.memo`. Wrap with `memo(function Name(...) {...})` and keep named function for React DevTools.

### [COMMENT]
- All `/* ── Section ── */` header comments in CSS files are identification comments → remove.
- All JSDoc `/** ... */` on functions → remove.
- All JSX `{/* Description prose */}` comment nodes → remove.
- All `// ── Section ──` dividers in TSX/TS → remove.
- Max 3 words only at genuine decision points.

### [EFFECT-DEPS]
- Modal.tsx: reading `mounted` state inside an effect that only had `open` in deps. Fix: use a `mountedRef` (useRef) to track mount state without adding it to deps array.
- SmMdl.tsx: `triggerConfirm` function called inside effect but not in deps. Fix: extract as `useCallback([onConfirm])` then include in effect deps.

## How to apply
Before any task: `grep -rn "console\." src/` + `grep -rn "eslint-disable" src/` + `grep -rn "key={i}\|key={idx}" src/` to pre-check status.
