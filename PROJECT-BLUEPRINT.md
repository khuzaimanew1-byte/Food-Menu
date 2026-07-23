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
| FEAT-07 | BE | API server — NestJS 10, health route | D |
| FEAT-16 | FE | icons/FrameBadge (bracket-corner frame, num prop) + icons/DiamondBadge (rotated diamond, recovered) | D |
| FEAT-14 | FE | components/icons/ SSoT: ArrowIcon, PrintIcon, FrameBadge, DiamondBadge, DiamondIcon (each owns CSS) | D |
| FEAT-13 | FE | Button/ system: base.css + icon-text.css + icon-only.css (no icons) | D |
| FEAT-12 | FE | PrintBtn — angular bracket-frame float, top-right overlap | D |
| FEAT-11 | FE | NavCtrl — full-width dock, diamond arrows + diamond page indicators | D |
| FEAT-06 | FE | Print button (superseded by FEAT-12) | D |
| FEAT-05 | FE | Page navigation (superseded by FEAT-11) | D |
| FEAT-15 | FE | MenuItemCard: crown avatar (clip-path + lantern bg + gold bar), BadgeIcon overlay, gradient dotted leader | D |
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
| 07-21 | Controls: PrintBtn floats top-right (translateY -50%); NavCtrl spans full width bottom (translateY 50%) — both inside pg-wrap | D |
| 07-21 | All custom names max 5-6 chars (files, vars, CSS, DB fields) | D |

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
07-23 — Badge→FrameBadge+DiamondBadge (recovered original rotate-45 diamond); num prop on both (undefined→no DOM node); DiamondBadge active in MenuItemCard; FrameBadge intact; CSS patches: mic padding-block 2cqw, border-bottom removed, mic-avt width 13cqw, mic-body padding-top removed (collision fix), mic-name 3.5cqw, mic-desc 2.7cqw, mic-lead height 0.4cqw+gap 2.8cqw, mic-price --gold, iavt commented widths, iavt-bar bottom 1% height .2cqw, bdgi bg --gl .08; avatar upload button (btn btio, no new CSS); prices Rs.
