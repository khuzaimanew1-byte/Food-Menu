# Infinity Castle's Cuisine — Digital Menu

A paginated digital restaurant menu (Arabic, Turkish, Grill, Desserts) with cover → content → closing pages, print support, and a unified control dock.

## Run & Operate

- **Menu app (preview):** managed by the `artifacts/menu: web` workflow — run `pnpm --filter @workspace/menu run dev` (PORT=26151, BASE_PATH=/)
- **API server:** `pnpm --filter @workspace/api-server run dev` (NestJS, port 8080)
- `pnpm install` — install all workspace dependencies (required after a fresh clone/import)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

_Populate as you build — short repo map plus pointers to the source-of-truth file for DB schema, API contracts, theme files, etc._

## Architecture decisions

_Populate as you build — non-obvious choices a reader couldn't infer from the code (3-5 bullets)._

## Product

_Describe the high-level user-facing capabilities of this app once they exist._

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
