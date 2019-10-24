import React from "react";
import Home from "./Home";
import Registry from "./Registry";
import RegistryIndex from "./RegistryIndex";
import NotFound from "./NotFound";
import PathBreadcrumbs from "./PathBreadcrumbs";
import Benchmarks from "./Benchmarks";
import { Container } from "@material-ui/core";
import { BrowserRouter, Redirect, Switch, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Container maxWidth="md">
        <PathBreadcrumbs />
        <Switch>
          <Route path="/benchmarks(.html)?" component={Benchmarks} />
          <Route path="/manual(.html)?">
            <Redirect to="/std/manual.md" />
          </Route>
          <Route path="/style_guide(.html)?">
            <Redirect to="/std/style_guide.md" />
          </Route>
          <Route path="/std/:stdPath" component={Registry} />
          <Route path="/std/" component={Registry} />
          <Route path="/std@:stdVersion/:stdPath" component={Registry} />
          <Route path="/x/:mod@:modVersion/:modPath" component={Registry} />
          <Route path="/x/:mod/:modPath" component={Registry} />
          <Route path="/x/:mod" component={Registry} />
          <Route path="/x/:mod@:modVersion" component={Registry} />
          <Route path="/x/" component={RegistryIndex} />
          <Route exact path="/" component={Home} />
          <Route path="*" component={NotFound} />
        </Switch>
      </Container>
    </BrowserRouter>
  );
}

export default App;
