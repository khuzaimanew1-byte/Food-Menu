# Assign Feature — Complete Workflow

## Jo File Padhi — Uska Har Hissa

**File:** `attached_assets/Pasted-Jobhi-files-tum-read-aur-ussmein-jo-understand-kar-rahe_1785313218241.txt`

### Line 1-4 — Context
Ye prompt hai. "Abhi kuch change nhin karo sirf analyze karo. Context menu mein jo assign option hai usse update karo."
Matlab ye build prompt hai Assign feature ke liye.

### Section 1 — Assign Indicator (AsgDot)
- Item card ke image ke bottom-right corner pe ek tiny dot lagega
- Dot = assignment status indicator
- Koi Assign record nahi → dot bilkul nahi dikhega (DOM mein hi nahi hoga)
- Dot badge ya label nahi — sirf ek colored circle
- **Codebase finding:** `mic-avt` pe `clip-path: var(--ic-poly)` hai — agar dot `mic-avt` ke andar daala toh polygon se clip ho jaayega. Fix: naya `div.mic-avt-wrap` wrapper banao, `mic-avt` ke bahar dot rakho, wrapper position:relative.

### Section 2 — Assign Modal (AsgMdl)
Base: `BsMdl`. Internal mode state (normal/edit).

**Normal Mode** (data exists):
- Header: item naam (quiet/small) + ✎ + ✕
- Body: employees + roles (pairs, wrap), resources + qty + unit (pairs, wrap), Margin Rs.{value}
- No data → "Not assigned" text

**Edit Mode** (first open ya ✎ click):
- Header: item naam + ✓ + ✕
- Poore `bs-dlg` pe edit-highlight border/glow (per-field nahi)
- ✓ disabled until koi bhi Resources field na bhari ho
- Cancel (first save se pehle) → koi record nahi banta, dot nahi dikhta

**BsMdl extension needed:** `headerActions?: ReactNode` prop add karna (✎ ya ✓ button ke liye)

**Wireframes:**
```
Edit Mode (first time):
Item Name                        ✓  ✕
Assign:
[Emp name field]   [Chef ▾]   [+]
Resources:
[resource field]   [0] [g▾]   [+]
                         Margin: Rs.0

Normal Mode (data exists):
Shawarma                         ✎  ✕
Assign:
Ahmad    chef    ali    barista
Resources:
Chicken  250g    Oil    20ml
Salt     5g
                         Margin: Rs.50

Edit Mode (existing data):
Shawarma                         ✓  ✕
Assign:
Ahmad   [chef▾]  ali   [barista▾]
[+]
Resources:
Chicken  [250] [g▾]    Oil    [20] [ml▾]
Salt     [5]   [g▾]
                    [+]
                         Margin: Rs.50
```

### Section 3 — EdtDrp (Edit Dropdown)
- Built on `DropdownPanel`/`OptRow` (OptRow already exported)
- Trigger = sirf `▾` icon (koi border, box, outline nahi)
- Har option pe per-option context menu (right-click/long-press)
- Context menu: Edit → label inline editable; Delete → existing `del:cnf` + `execDel` chain
- Rename globally updates roles/units DB tables

### Section 4 — Visual Style
- Infinity Castle theme: dark obsidian surfaces, subtle indigo-violet gradients
- Gold accent (`--gold`, `--gl`) for ✓, ✎, ▾ icon, edit-highlight
- Edit-mode glow on `bs-dlg`
- Existing CSS tokens reuse — no nayi vars

### Section 5 — Row Rules & Delete Logic
| Block     | Min rows | Delete icon kab |
|-----------|----------|-----------------|
| Employees | 0        | Hamesha (last row pe bhi) |
| Resources | 1        | Sirf jab 2+ rows hon |

### Section 6 — Data Layer
- `assign.ts` stub → dispatch `asg:open` custom event
- `assignStore`, `roleStore`, `unitStore` — 3 nayi files (plain TS module pattern)
- DB: `roles`, `units`, `assigns`, `assign_emps`, `assign_rsrcs` tables
- `delExec.ts` extend — 'role' and 'unit' types add karna

---

## Codebase Mein Kya Mila

### assign.ts (stub)
```ts
export function assignItem(id: string | null): void { void id; }
```
Wiring ready hai: `actions/index.ts` mein `case 'assign': return assignItem(id)` already hai.

### BsMdl
- Portal-rendered, z-index:400
- Props: `open`, `onClose`, `title`, `children`
- Header: `bs-ttl` + `bs-cls` (X button) — `headerActions` prop add karni hogi

### DropdownPanel
- `OptRow` exported memo component — EdtDrp mein reuse hoga
- `CtxOpt` interface available — role/unit options usi format mein
- Panel absolute-positioned with left/top

### menuStore pattern
- Plain TS module, no React
- Dispatches `menu:change` DOM event
- assignStore same pattern follow karega, dispatches `assign:change`

### delExec.ts
- `DelType = 'item' | 'section'` — extend karna hoga with 'role' | 'unit'
- `del:cnf` event → `execDel` chain
- EdtDrp ke Delete action ke liye same chain reuse

### MnItm.tsx + MnItm.css
- `mic-avt`: `position: relative; clip-path: var(--avt-clip, none)` — dot gets clipped
- Fix: wrap `mic-avt` in new `div.mic-avt-wrap` (position:relative), dot bahar

### variables.css tokens
- `--gold`, `--gl`, `--gm`, `--lntn` — edit-highlight ke liye
- `--dng`, `--dngh` — danger delete ke liye
- `--ink`, `--chrd` — dark surfaces

---

## Step-by-Step Workflow

### STEP 1 — DB Schema (5 new tables) ✅ CURRENT
**Understanding:** Roles aur units globally reusable lookup tables hain. Assigns ek item se 1-to-1 linked hai (unique item_id). Assign_emps aur assign_rsrcs assign se 1-to-many.

**Files to create:**
- `lib/db/src/schema/roles.ts`
- `lib/db/src/schema/units.ts`
- `lib/db/src/schema/assigns.ts`
- `lib/db/src/schema/assign_emps.ts`
- `lib/db/src/schema/assign_rsrcs.ts`
- Update `lib/db/src/schema/index.ts`
- Run: `pnpm --filter @workspace/db run push`

### STEP 2 — API Server (AssignMod)
**Understanding:** NestJS pattern follow karna hai (jaise MenuMod). Assign ke liye upsert approach — poora record ek transaction mein save. Roles/units ke liye standard CRUD.

**Files to create:**
- `artifacts/api-server/src/assign/assign.svc.ts`
- `artifacts/api-server/src/assign/assigns.ctrl.ts`
- `artifacts/api-server/src/assign/roles.ctrl.ts`
- `artifacts/api-server/src/assign/units.ctrl.ts`
- `artifacts/api-server/src/assign/assign.mod.ts`
- Update `artifacts/api-server/src/app.mod.ts`
- Rebuild + restart api-server

### STEP 3 — Frontend Stores
**Understanding:** Plain TS module pattern (jaise menuStore). assignStore Map<itemId, record> rakhega. roleStore aur unitStore lazy-load karenge (pehli baar AsgMdl open hone pe).

**Files to create:**
- `artifacts/restaurant-pos/src/lib/asg/asgSync.ts`
- `artifacts/restaurant-pos/src/lib/asg/assignStore.ts`
- `artifacts/restaurant-pos/src/lib/asg/roleStore.ts`
- `artifacts/restaurant-pos/src/lib/asg/unitStore.ts`

### STEP 4 — AsgDot Component + MnItm Update
**Understanding:** Dot `mic-avt-wrap` ke andar, `mic-avt` ke bahar (clip-path se bachao). `useHasAssign` hook assignStore subscribe karega.

**Files to create/update:**
- `artifacts/restaurant-pos/src/components/AsgDot/AsgDot.tsx`
- `artifacts/restaurant-pos/src/components/AsgDot/AsgDot.css`
- Update `artifacts/restaurant-pos/src/components/MnItm/MnItm.tsx`
- Update `artifacts/restaurant-pos/src/components/MnItm/MnItm.css`

### STEP 5 — EdtDrp Component
**Understanding:** ▾ trigger only. OptRow reuse karo. Per-option long-press/right-click → tiny context menu with Edit + Delete. Edit = inline input rename. Delete = `del:cnf` event.

**Files to create:**
- `artifacts/restaurant-pos/src/components/EdtDrp/EdtDrp.tsx`
- `artifacts/restaurant-pos/src/components/EdtDrp/EdtDrp.css`

### STEP 6 — BsMdl Update + AsgMdl Component
**Understanding:** BsMdl mein `headerActions` prop add karo. AsgMdl internal mode state (normal/edit) rakhega. `asg:open` event listen karega. Roles/units load karega on mount.

**Files to create/update:**
- Update `artifacts/restaurant-pos/src/components/BsMdl/BsMdl.tsx`
- `artifacts/restaurant-pos/src/components/AsgMdl/AsgMdl.tsx`
- `artifacts/restaurant-pos/src/components/AsgMdl/AsgMdl.css`

### STEP 7 — Wire Everything
**Understanding:** assign.ts ko event dispatch karna hai. MnPg.tsx mein AsgMdl add karna hai (jaise DelCnf). delExec.ts extend karna hai for 'role' aur 'unit' types.

**Files to update:**
- `artifacts/restaurant-pos/src/components/ContextMenu/actions/item/assign.ts`
- `artifacts/restaurant-pos/src/pg/mn-pg/MnPg.tsx`
- `artifacts/restaurant-pos/src/lib/del/delExec.ts`

### STEP 8 — Verify
- Screenshot le ke check karo
- Right-click item → Assign → modal khule
- Edit mode → save → dot dikhe
- Normal mode → ✎ click → edit mode
