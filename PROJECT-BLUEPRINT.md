# BLUEPRINT — scan only, don't read linearly

## 1. CORE
Infinity Castle's Cuisine — digital restaurant menu (Arabic, Turkish, Grill, Desserts); paginated cover→content→closing; print support.

---

## 2. FEATURES
IDs: FEAT-09, FEAT-08, FEAT-07, FEAT-06, FEAT-05, FEAT-04, FEAT-03, FEAT-02, FEAT-01

| ID | Area | Name | Status |
|---|---|---|---|
| FEAT-10 | BE | Neon serverless driver (neon-http) in lib/db | D |
| FEAT-09 | BE | OpenAPI codegen (Orval → hooks + Zod) | D |
| FEAT-08 | DB | DB layer (Drizzle + neon-http) — no schema yet | X |
| FEAT-18 | FE | Dynamic single-col pagination: items overflow to next page; 40% rule for section start; crown on first heading per page only; 2 sections (ARBC+TURK) | D |
| FEAT-19 | FE | Image-based decorative system: brd.png border overlay, pgbg.png content bg, ornt.png ornaments (top+bottom, flipped) on cover/closing; coded SVG border+crown removed | D |
| FEAT-07 | BE | API server — NestJS 10, health route | D |
| FEAT-17 | FE | Selection UI: ChkBx component, check overlay on avatar, gold glow, strikethrough, opacity fade | D |
| FEAT-14 | FE | components/icons/ SSoT: ArrowIcon, PrintIcon, DiamondIcon (each owns CSS) | D |
| FEAT-13 | FE | Button/ system: base.css + icon-text.css + icon-only.css (no icons) | D |
| FEAT-12 | FE | PrintBtn — angular bracket-frame float, top-right overlap | D |
| FEAT-11 | FE | NavCtrl — full-width dock, diamond arrows + diamond page indicators | D |
| FEAT-06 | FE | Print button (superseded by FEAT-12) | D |
| FEAT-05 | FE | Page navigation (superseded by FEAT-11) | D |
| FEAT-15 | FE | MenuItemCard: crown avatar (clip-path + lantern bg + gold bar), gradient dotted leader, selection UI | D |
| FEAT-04 | FE | Menu item cards (name, desc, price, avatar) | D |
| FEAT-03 | FE | Closing page — static bg image | D |
| FEAT-02 | FE | Content pages — 4 category sections | D |
| FEAT-01 | FE | Cover page — static bg image | D |

---

## 3. ARCHITECTURE
Tags: STACK, FOLDER, CODEGEN, IMAGES, NAMING, STYLES, RULES

| Tag | Decision |
|---|---|
| RULES | SSOT-Rules.md at root governs all code |
| STYLES | globals.css / variables.css / typography.css only global; page CSS in styles/; button base in components/Button/; icons in components/icons/ (each owns its CSS) |
| ICONS | components/icons/ = SSoT for all visual-only SVG/icon components. Button/ = style only, no icons. Feature components import icons from icons/, styles from Button/. |
| NAMING | All custom names max 5-6 chars, recognizable short forms |
| IMAGES | Static images → artifacts/menu/public/img/, served via BASE_URL prefix |
| CODEGEN | OpenAPI spec → Orval → lib/api-client-react + lib/api-zod (never manual) |
| FOLDER | pnpm workspace: artifacts/ (apps) · lib/ (shared libs) · scripts/ |
| STACK | React 19 · Vite 7 · Tailwind 4 · NestJS 10 · Drizzle · Neon · TS 5.9 |

---

## 4. STANDING INSTRUCTIONS
| Date | Rule | Status |
|---|---|---|
| 07-21 | Pre-task: scan SSOT-Rules.md + §4+§5 keyword-matched rows; conflict→stop+flag | D |
| 07-21 | Post-task: update PROJECT-BLUEPRINT.md silently, no narration, no permission-ask | D |
| 07-21 | "remember this"/"from now on" → log §4 immediately, dated, one line, apply unprompted | D |
| 07-21 | Check SSOT-Rules.md tags before every task | D |
| 07-21 | Images: WebP in public/img/, max 5-6 char names | D |
| 07-25 | Decorative images are aria-hidden="true"; border (brd.png) is object-fit:fill; bg (pgbg.png) is object-fit:cover; ornaments are 27% wide | D |
| 07-21 | Controls: PrintBtn floats top-right (translateY -50%); NavCtrl spans full width bottom (translateY 50%) — both inside pg-wrap | D |
| 07-21 | All custom names max 5-6 chars (files, vars, CSS, DB fields) | D |
| 07-27 | Tooltip base: `.tip` (layout/border/shadow/anim) + `.dkgl` (bg) — never create component-level tooltip from scratch; always compose from these two | D |
| 07-27 | Disabled state: only `.disabled` class (Button/base.css) — no per-component custom disabled CSS | D |

---

## 5. WATCHOUTS
| Date | Note | Status |
|---|---|---|
| 07-21 | DATABASE_URL not provisioned; DB unusable until set | ! |
| 07-21 | DB schema empty — assume no tables exist | ! |
| 07-21 | Menu items hardcoded in App.tsx, not from DB | ! |
| 07-21 | 20+ Radix/shadcn ui/ wrappers installed, unused by app pages | X |
| 07-21 | Prettier installed, no config file, not enforced | X |
| 07-21 | @rollup/rollup-win32-x64-msvc in root deps — Windows binary, dead on Replit | X |

---

## 6. ARCHIVE INDEX
No archived rows yet. Archive triggers at 25 active rows per table → BLUEPRINT-ARCHIVE.md.

---

## 7. LAST TOUCHED
07-26 — SmMdl created: lightweight anchored confirmation panel (no full-screen overlay). ClsIco added to icons/ SSoT. CnfMdl completely removed (component + CSS + folder). EdtCnf in App.tsx updated to use SmMdl (onClose replaces onCancel). SmMdl: Enter→confirm flash (90ms)→action; × button→onClose; exit 70ms (faster than 110ms entry); keyboard cleanup on close; ↩ Enter hint text. contextMenuConfig: assign option added to item area (after edit). CSS fixes: mic-lead mask transparent 130%, ic-bdr padding 0.3cqw, mb-bg width/height commented, a4-box width/height commented, UplBtn dkgl bg applied.
