---
name: Scope Discipline Rule
description: Page-specific init/destroy logic belongs in the page component (MnPg), not in main.tsx or global scope — even when only one page exists today.
---

## Rule

Jo logic **page-specific** hai (kisi specific page/component ke context mein hi valid hai — jaise `initEdt`, `initSpl`, `initMv`), woh us **page-level** (jaise `MnPg`) mein hi define/init/destroy honi chahiye — global (`main.tsx`) mein nahi, **chahe abhi app mein sirf ek hi page kyun na ho**.

Jo logic genuinely **app-wide/global** hai, wahi global scope mein rahe.

**Why:**
Agar page-specific init/destroy globally boot ho toh future mein naye pages add karte waqt existing page-specific logic unintentionally un naye pages ke elements pe bhi fire ho jaati hai — architecture brittle aur non-scalable ban jaati hai.

**How to apply:**
- `main.tsx` sirf `createRoot(...).render(<App />)` karega — koi init calls nahi
- `MnPg` ke `useEffect` mein: `initSpl()`, `initEdt()`, `initMv()` on mount; `destroySpl()`, `destroyEdt()`, `destroyMv()` on unmount
- `pg:goto` listener bhi MnPg-scoped `useEffect` mein — global nahi
- `menu:change` listener already MnPg-scoped hai (line 33–37 MnPg.tsx) — yahi pattern follow karo
- Koi bhi naya page-specific event listener ya observer → pehle check karo: kya ye sirf is page ke liye hai? Agar haan → page component mein rakho
