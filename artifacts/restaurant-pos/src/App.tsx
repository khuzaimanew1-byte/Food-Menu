import { Switch, Route } from "wouter";
import { MnPg }   from "./pg/mn-pg/MnPg";
import { AvtDmo } from "./components/AvtDmo/AvtDmo";

export default function App() {
  return (
    <Switch>
      <Route path="/demo" component={AvtDmo} />
      <Route path="/" component={MnPg} />
    </Switch>
  );
}
