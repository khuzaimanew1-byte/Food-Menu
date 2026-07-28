---
name: DB production setup
description: What was done to make the DB-backed API production-ready; SSOT compliance status per tag.
---

# DB production setup

## Schema applied
- `pnpm --filter @workspace/db run push` — tables sects + items created against Neon.
- `pnpm --filter @workspace/db run seed` — seeded Arabic (15 items) + Turkish (15 items).
- lib/db/src/schema/ is the SSOT; drizzle-zod validators are auto-generated from it.

## SSOT compliance after this session

| Tag | Status | Notes |
|---|---|---|
| DB-SSOT | ✅ | OpenAPI → Orval → generated clients |
| DB-ID | ✅ | NanoID PKs via mkId() |
| DB-ASSET | ✅ | img stores asset key only |
| DB-INDEX | ✅ | FK + composite ordering indexes |
| DB-SELECT | ✅ | SECT_COLS / ITEM_COLS projections |
| DB-CONSTRAINT | ✅ | NOT NULL, CHECK, FK CASCADE |
| DB-TX | ✅ | All multi-step writes in transactions |
| DB-CACHE | ✅ | Cache-Control on GET endpoints (list=10s, item=30s, swr) |
| DB-POOL | ✅ | pg.Pool max=10, 10s statement timeout |
| DB-TIMEOUT | ✅ | SET statement_timeout='10s' on connect |
| HTTP-COMPRESS | ✅ | compression() middleware in main.ts |
| HTTP-CACHE | ✅ | Cache-Control headers on all GET routes |
| SEC-RATE | ✅ | ThrottlerModule 120 req/min via APP_GUARD |
| SEC-CORS | ✅ | origin:false in prod, permissive in dev |

## Reorder optimization
reordSects and reordItems use a single CASE UPDATE instead of N individual UPDATEs — O(1) DB round-trips regardless of list size.

**Why:** Loop-based updates hold a transaction open for each row, causing lock contention at scale. Single CASE UPDATE is atomic and fast.
