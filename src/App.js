import React from "react";
import { Container } from "@material-ui/core";
import { Redirect, Route, Switch } from "react-router-dom";
import PathBreadcrumbs from "./component/PathBreadcrumbs";
import Spinner from "./component/Spinner";
import HashLinkHandler from "./component/HashLinkHandler";

const { Suspense } = React;

const Home = React.lazy(() => import("./page/Home"));
const RegistryIndex = React.lazy(() => import("./page/RegistryIndex"));
const Benchmarks = React.lazy(() => import("./page/Benchmarks"));
const NotFound = React.lazy(() => import("./page/NotFound"));
const LazyRegistry = React.lazy(() => import("./page/Registry"));

function Registry() {
  return (
    <Suspense fallback={<Spinner />}>
      <LazyRegistry />
    </Suspense>
  );
}

function manualRedirect() {
  window.location.href = "https://github.com/denoland/deno/blob/master/docs";
  return null;
}

function App() {
  return (
    <HashLinkHandler>
      <Container maxWidth="md">
        <PathBreadcrumbs />
        <Switch>
          <Route
            path="/benchmarks(.html)?"
            render={() => (
              <Suspense fallback={<Spinner />}>
                <Benchmarks />
              </Suspense>
            )}
          />
          <Route path="/manual(.html)?" component={manualRedirect} />
          <Route path="/std/manual.md" component={manualRedirect} />
          <Route path="/std@:stdVersion/manual.md" component={manualRedirect} />
          <Route path="/x/std/manual.md" component={manualRedirect} />
          <Route
            path="/x/std@:stdVersion/manual.md"
            component={manualRedirect}
          />
          <Route path="/style_guide(.html)?">
            <Redirect to="/std/style_guide.md" />
          </Route>
          <Route path="/std/" component={Registry} strict />
          <Route path="/std/:stdPath" component={Registry} />
          <Route path="/std@:stdVersion/" component={Registry} strict />
          <Route path="/std@:stdVersion/:stdPath" component={Registry} />
          <Route path="/std" component={AddTrailingSlash} strict />
          <Route path="/std@:stdVersion" component={AddTrailingSlash} strict />
          <Route path="/x/:mod/" component={Registry} strict />
          <Route path="/x/:mod/:modPath" component={Registry} />
          <Route path="/x/:mod@:modVersion/" component={Registry} strict />
          <Route path="/x/:mod@:modVersion/:modPath" component={Registry} />
          <Route path="/x/:mod" component={AddTrailingSlash} strict />
          <Route
            path="/x/:mod@:modVersion"
            component={AddTrailingSlash}
            strict
          />
          <Route
            path="/x/"
            render={() => (
              <Suspense fallback={<Spinner />}>
                <RegistryIndex />
              </Suspense>
            )}
            exact
          />
          <Route
            exact
            path="/"
            render={() => (
              <Suspense fallback={<Spinner />}>
                <Home></Home>
              </Suspense>
            )}
          />
          <Route
            path="*"
            render={() => (
              <Suspense fallback={<Spinner />}>
                <NotFound />
              </Suspense>
            )}
          />
        </Switch>
      </Container>
    </HashLinkHandler>
  );
}

const AddTrailingSlash = ({ location: { pathname } }) => (
  <Redirect to={`${pathname}/`} />
);

export default App;
