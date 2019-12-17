import React from "react";
import useHashLink from "./useHashLink";
import PathBreadcrumbs from "./PathBreadcrumbs";
import { Container } from "@material-ui/core";
import { BrowserRouter, Redirect, Switch, Route } from "react-router-dom";
import Spinner from "./Spinner";

const { Suspense } = React;

const Home = React.lazy(() => import("./Home"));
const RegistryIndex = React.lazy(() => import("./RegistryIndex"));
const Benchmarks = React.lazy(() => import("./Benchmarks"));
const NotFound = React.lazy(() => import("./NotFound"));
const LazyRegistry = React.lazy(() => import("./Registry"));
function Registry() {
  return (
    <Suspense fallback={<Loading />}>
      <LazyRegistry />
    </Suspense>
  );
}

function Loading() {
  return <Spinner />;
}

function App() {
  useHashLink();

  React.useEffect(() => {
    const { pathname } = document.location;
    document.title = `deno ${pathname}`;
  }, []);

  return (
    <BrowserRouter>
      <Container maxWidth="md">
        <PathBreadcrumbs />
        <Switch>
          <Route
            path="/benchmarks(.html)?"
            render={() => (
              <Suspense fallback={<Loading />}>
                <Benchmarks />
              </Suspense>
            )}
          />
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
          <Route
            path="/x/"
            render={() => (
              <Suspense fallback={<Loading />}>
                <RegistryIndex />
              </Suspense>
            )}
          />
          <Route
            exact
            path="/"
            render={() => (
              <Suspense fallback={<Loading />}>
                <Home></Home>
              </Suspense>
            )}
          />
          <Route
            path="*"
            render={() => (
              <Suspense fallback={<Loading />}>
                <NotFound />
              </Suspense>
            )}
          />
        </Switch>
      </Container>
    </BrowserRouter>
  );
}

export default App;
