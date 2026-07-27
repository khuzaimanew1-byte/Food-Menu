// ── App — entry point ─────────────────────────────────────────────────────
// No page specification here. Each page type lives in its own pg/* folder.
// App only picks which top-level view to mount.

import { MnPg }  from "./pg/mn-pg/MnPg";
import { AvtDmo } from "./components/AvtDmo/AvtDmo";

export default function App() {
  const isDemo = new URLSearchParams(window.location.search).has("demo");
  return isDemo ? <AvtDmo /> : <MnPg />;
}
