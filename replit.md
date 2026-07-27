# Infinity Castle's Cuisine Menu

A rich, animated digital menu viewer for **Infinity Castle's Cuisine** — a restaurant serving Arabic, Turkish, Grill & Dessert dishes.

## What it does

- Displays a paginated, animated menu in an A4-page format (cover → content pages → closing)
- Right-click context menu lets you edit items, reorder sections/items via drag-style move/paste, add or delete entries, and change page shapes
- Print button exports the current view
- All menu data lives in `artifacts/restaurant-pos/src/data/menu.ts` and is managed in-memory via `menuStore`

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React 19 + Vite 7 + TypeScript |
| Styling | Tailwind CSS v4 + custom CSS |
| Animation | Framer Motion |
| Routing | Wouter |
| Monorepo | pnpm workspaces |

## How to run

The dev server starts automatically via the **"artifacts/restaurant-pos: web"** workflow:

```
PORT=26151 pnpm --filter @workspace/restaurant-pos run dev
```

App is served at `/` (preview path).

## Project structure

```
artifacts/
  restaurant-pos/      ← main menu app
    src/
      components/      ← UI components (ContextMenu, NvCtl, PrtBtn, CvrPg, …)
      data/menu.ts     ← all menu item data
      lib/
        menu/          ← menuStore (SSOT for section/item state)
        mv/            ← move-mode store (drag-to-reorder)
        spl/           ← pointer hit-test helpers
      pg/mn-pg/        ← main page orchestrator (pagination, transitions)
  api-server/          ← Express API server (not currently used by the menu app)
  mockup-sandbox/      ← Vite sandbox for UI component mockups (canvas/design)
```

## User preferences

_None recorded yet._
