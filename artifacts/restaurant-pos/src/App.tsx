// ── App — router shell ────────────────────────────────────────────────────
// No page content here. Each page lives in its own pg/* folder.
// To add a new page: create pg/<slug>/<Pg>.tsx and add a Route below.

import { Switch, Route } from "wouter";

import { MnPg }  from "./pg/mn-pg/MnPg";
import { AvtDmo } from "./components/AvtDmo/AvtDmo";

export default function App() {
  return (
    <Switch>
      <Route path="/demo" component={AvtDmo} />
      <Route path="/" component={MnPg} />
    </Switch>
  );
}
