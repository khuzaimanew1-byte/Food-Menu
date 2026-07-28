# Infinity Castle's Cuisine — Digital Restaurant Menu

## Project Overview

A paginated digital restaurant menu for **Infinity Castle's Cuisine** featuring Arabic, Turkish, Grill, and Desserts categories. Built as a React 19 + Vite 7 SPA with print support, decorative image overlays, and a custom menu-item card system.

## How to Run

The dev server starts automatically via the configured workflow:

```
PORT=26151 BASE_PATH=/ pnpm --filter @workspace/restaurant-pos run dev
```

Dependencies: `pnpm install` (run from workspace root)

## Stack

- **Frontend:** React 19, Vite 7, Tailwind CSS 4, TypeScript 5.9
- **Backend (stub):** NestJS 10 API server in `artifacts/api-server/` — health route only
- **DB (not active):** Drizzle ORM + Neon (neon-http) — `DATABASE_URL` secret not set, schema empty
- **Shared libs:** `lib/api-client-react`, `lib/api-zod` (OpenAPI codegen via Orval)

## Project Structure

```
artifacts/restaurant-pos/   ← Main frontend app
artifacts/api-server/       ← NestJS backend stub
lib/                        ← Shared generated libs
scripts/                    ← Workspace scripts
```

## Key Files

- `artifacts/restaurant-pos/src/App.tsx` — root component, menu data (hardcoded)
- `artifacts/restaurant-pos/src/pg/` — page components (cover, content, closing)
- `artifacts/restaurant-pos/src/components/` — shared UI components
- `PROJECT-BLUEPRINT.md` — feature registry, architecture decisions, standing rules
- `SSOT-Rules.md` — naming + style rules (must be checked before any task)

## Architecture Rules (from SSOT-Rules.md + PROJECT-BLUEPRINT.md)

- All custom names max 5–6 chars (files, vars, CSS, DB fields)
- Global styles only in `globals.css` / `variables.css` / `typography.css`
- Images: WebP in `public/img/`, max 5–6 char filenames
- Tooltip: always compose from `.tip` + `.dkgl` base classes
- Disabled state: only `.disabled` class from `Button/base.css`
- Comma/number formatting: Pakistani lakh/crore system (e.g. 1,00,000), no decimals

## Known Watchouts

- `DATABASE_URL` not provisioned — DB layer is unusable until set
- Menu items are hardcoded in `App.tsx`, not fetched from DB
- DB schema is empty — no tables exist

## User Preferences

- Analysis/planning notes are delivered before implementation confirmation — no code changes until explicitly confirmed
