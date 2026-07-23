# SSOT-Rules

On every task: identify keywords → check Tier 1 for section(s) → scan that section's Tags line → read only matching tag lines + any Base/Universal tags that match → implement → self-check only against tags you read. New task with no clear match → ask once, don't guess. Never announce this process.

---

## Tier 1 — Section Lookup

| Task touches… | Section |
|---|---|
| UI / component / React | FRONTEND |
| CSS / Tailwind / design | STYLING |
| hooks / state / business logic | LOGIC |
| API / Express / server | BACKEND |
| schema / ORM / query | DATABASE |
| new file or folder | ARCHITECTURE |
| editing existing code | REFACTORING |
| speed / bundle / cache | OPTIMIZATION |
| auth / input / exposure | SECURITY |

---

## BASE
Tags: [BASE-BLUEPRINT] [BASE-BEST] [BASE-SSOT] [BASE-REUSE]

[BASE-BLUEPRINT] One blueprint file in project root; every addition/change must be recorded in it.
[BASE-BEST] Auto-apply best practice for performance, security, maintainability — even when not explicitly asked; mediocre/working-only is forbidden.
[BASE-SSOT] All SSOT rules apply to every existing and new line; any violation must be refactored until compliant.
[BASE-REUSE] Search entire codebase before writing; reuse/extend/consolidate — functionally identical logic, components, styles, hooks, utils, services, validations, types, constants, configs are duplicates and forbidden.

---

## FRONTEND
Tags: [NAME-LEN] [COMP-SPLIT] [COMP-STRUCT] [PAGE-CSS] [MODAL-MOUNT] [MODAL-HYBRID] [ANIM-SMOOTH] [NAV-ANIM]

[NAME-LEN] All custom names (CSS vars & classes, JS vars, functions, DB fields, files, folders) max 5-6 chars using recognizable short forms.
[COMP-SPLIT] Every component — from smallest to largest — lives in its own dedicated UI component file.
[COMP-STRUCT] UI, logic, styles, types, and assets in separate files; keep colocated so responsibility is obvious.
[ANIM-SMOOTH] Apply smooth animation throughout the entire app.
[NAV-ANIM] Creative navigation animations on every page and component; animate relative to nav position so transition is always perceivable.

---

## REFACTORING
Tags: [FIX-UX] [COMMENT] [NO-DEAD] [NO-LOG] [MIN-CODE]

[FIX-UX] Code changes must not alter visible UX/UI even slightly; internal/backend code may change freely as long as result and experience are identical or better.
[COMMENT] Comments only at genuinely major decision points (Which needs comments badly then give it); max 3 words; no explanatory prose or unnecessary indentification comments.
[NO-DEAD] Remove all unused, dead, duplicate (same logic/lines anywhere in project), and overriding code/styles/logic — none may exist anywhere in the codebase.
[NO-LOG] console.log forbidden everywhere; console.error allowed only for genuine runtime errors.
[MIN-CODE] Write minimal optimized logic; avoid redundant conditions, duplicate implementations, custom code replicating existing behavior; no two identical lines anywhere in the project; prefer simplest maintainable solution.
[CSS-NODUP] No duplicate or overriding styles anywhere in the project; remove if found.

---


## STYLING
Tags: [CSS-GLOBALS] [CSS-UTIL] [CSS-NOHARD] [CSS-NODUP]

[CSS-GLOBALS] Three global files only — globals.css (reset, body, scrollbar), variables.css (all CSS vars: colors, spacing, fonts), typography.css (all text styles).
[CSS-UTIL] Any style used 5+ times → move to utilities.css.
[CSS-NOHARD] font-family and color values strictly forbidden as hardcoded literals; use CSS vars only.
---

## LOGIC
Tags: [LIST-KEY] [EFFECT-DEPS] [MEMO-HEAVY] [DEBOUNCE] [MOD-ARCH]

[LIST-KEY] List rendering key = unique ID always; array index forbidden.
[EFFECT-DEPS] useEffect dependencies array must be clean; no unnecessary entries.
[MEMO-HEAVY] Heavy computation → useMemo mandatory; React.memo on pure components; useCallback on expensive callbacks.
[DEBOUNCE] Search and input fields → 300ms debounce.
[MOD-ARCH] One responsibility per file; colocate feature code with its owner; never merge single-purpose files; only global concerns in global files.
[MODAL-MOUNT] Modals mount on trigger, unmount on close.
[MODAL-HYBRID] Specified large modals only: open=mount immediately, close=10s countdown then unmount, reopen=cancel countdown. // hybrid mount
---


## DATABASE
Tags: [DB-SSOT] [DB-INDEX] [DB-SELECT] [DB-CACHE] [DB-POOL] [DB-TIMEOUT]

[DB-SSOT] DB schema is source of truth for data; OpenAPI spec is source of truth for all public APIs; all frontend clients, hooks, types, Zod schemas must be generated from OpenAPI spec — no manual duplicates.
[DB-INDEX] Index on every foreign key; composite index on frequently queried field combinations.
[DB-SELECT] SELECT * forbidden; always specify needed fields.
[DB-CACHE] Cache static/config data; never hit DB on every request for immutable data.
[DB-POOL] DB connection pooling mandatory; new connection per request forbidden.
[DB-TIMEOUT] Set timeout on all DB queries.

---

## BACKEND
Tags: [API-PAGINATE] [API-FIELDS] [API-BULK] [TASK-QUEUE] [HTTP-COMPRESS] [HTTP-CACHE] [LOG-SECURE]

[API-PAGINATE] Every list API must be paginated; default page size 20.
[API-FIELDS] Response contains only needed fields; N+1 queries forbidden.
[API-BULK] All mutation endpoints must support bulk operations.
[TASK-QUEUE] Long-running tasks → background queue; never block API response.
[HTTP-COMPRESS] gzip/brotli compression mandatory on all responses.
[HTTP-CACHE] Cache-Control headers required on all identical/static responses; ETag/Last-Modified support mandatory.
[LOG-SECURE] Never log sensitive data — passwords, tokens, PII.

---

## OPTIMIZATION
Tags: [OPT-VSCRL] [OPT-IMG] [OPT-FIRST] [OPT-CHUNK] [OPT-IMPORT] [OPT-DEFER] [OPT-WILL] [OPT-WORKER] [OPT-PRELOAD] [OPT-SW] [OPT-INTERSECT] [REQ-STORE] [REQ-CLEAN] [REQ-TAB] [REQ-PURGE] [REQ-BATCH] [REQ-CHUNK] [REQ-DEDUP] [REQ-PRIO] [REQ-CIRCUIT] [REQ-COMPRESS] [REQ-ISOLATE] [NET-IMG] [NET-SVG] [NET-FONT] [NET-BATCH] [NET-HTTP2] [NET-DNS] [NET-CSS]

[OPT-VSCRL] Lists with 50+ items → react-window virtual scroll mandatory.
[OPT-IMG] All images → loading="lazy" by default.
[OPT-FIRST] First screen loads only essential JS/CSS; defer everything else.
[OPT-CHUNK] Each page = its own chunk; bundle max 150kb gzipped.
[OPT-IMPORT] Always partial import `import {fn} from 'lib'`; full barrel imports forbidden.
[OPT-DEFER] All 3rd-party scripts → defer or async only.
[OPT-WILL] will-change only on actively animated elements; never as a blanket property.
[OPT-WORKER] Heavy computation → Web Worker; main thread must never block.
[OPT-PRELOAD] `<link rel="preload">` for fonts and hero images.
[OPT-SW] Service Worker mandatory for asset caching and offline support.
[OPT-INTERSECT] Elements render and animate only when entering viewport via IntersectionObserver.
[REQ-STORE] Requests stored in IndexedDB; max 3 active requests in RAM at any time.
[REQ-CLEAN] Request complete → immediately delete from RAM and IndexedDB.
[REQ-TAB] Tab close → flush RAM, persist IndexedDB; resume on return.
[REQ-PURGE] Every 5min: purge completed; purge cache older than 1hr; storage >80% → delete oldest low-priority.
[REQ-BATCH] Adaptive batching: 1-3=immediate(100ms), 4-15=batch3/500ms, 16-40=batch8/1s, 41-100=batch15/2s, 100+=batch25/3s+backpressure.
[REQ-CHUNK] Payload 50kb+ → split into 50kb chunks, send parallel; failed chunk → retry that chunk only, not full request.
[REQ-DEDUP] Same request in-queue or in-flight → drop and share response; cache response 30s → same request returns cached, no API call.
[REQ-PRIO] P0 Critical=queue bypass (auth), P1 High=next batch (user actions), P2 Normal=normal queue, P3 Low=idle time / silently drop on flood.
[REQ-CIRCUIT] 5 consecutive errors → OPEN 10s; 1 probe request → success=CLOSED / fail=OPEN 20s; retry backoff: 1s→2s→4s→8s, max 3 retries, 30s total timeout.
[REQ-COMPRESS] Payload 1kb+ → gzip; strip nulls/undefined from JSON; binary data → ArrayBuffer; base64 forbidden.
[REQ-ISOLATE] Per-account IndexedDB namespacing: acc_{id}_queue, acc_{id}_cache, acc_{id}_failed; only active account's data in RAM.
[NET-IMG] Images must be WebP format, max 200kb.
[NET-SVG] SVG under 2kb → inline in markup.
[NET-FONT] Load only font weights actually used in the app.
[NET-BATCH] Batch multiple concurrent API calls where possible.
[NET-HTTP2] HTTP/2 must be enabled on the server.
[NET-DNS] `<link rel="dns-prefetch">` for all third-party domains.
[NET-CSS] Critical CSS inlined in `<head>`; non-critical deferred.

---

## SECURITY
Tags: [SEC-INPUT] [SEC-RATE] [SEC-HTTPS] [SEC-JWT] [SEC-CORS]

[SEC-INPUT] Sanitize all user input on the frontend as well as backend.
[SEC-RATE] Rate limiting mandatory on all API endpoints.
[SEC-HTTPS] HTTPS only; HTTP requests must redirect to HTTPS.
[SEC-JWT] JWT short expiry + refresh token pattern; long-lived tokens forbidden.
[SEC-CORS] CORS strictly configured; wildcard `*` origin forbidden in production.
