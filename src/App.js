import React from "react";
import { Container } from "@material-ui/core";
import {
  BrowserRouter,
  Redirect,
  Route,
  Switch,
  useLocation
} from "react-router-dom";
import PathBreadcrumbs from "./component/PathBreadcrumbs";
import Spinner from "./component/Spinner";
import HashLinkHandler from "./component/HashLinkHandler";
import { proxy } from "./util/registry_utils";

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

function AddRef() {
  const [path, setPath] = React.useState(null);
  const { pathname, search, hash } = useLocation();
  React.useEffect(() => {
    (async () => {
      const {
        entry: { branch }
      } = await proxy(pathname);
      let pathWithRef;
      if (pathname.startsWith("/std")) {
        pathWithRef = pathname.replace(/^\/std/, `/std@${branch}`);
      } else {
        pathWithRef = pathname.replace(/^\/x\/([^/]+)/, `/x/$1@${branch}`);
      }
      setPath(pathWithRef);
    })();
  }, [pathname]);
  if (path == null) {
    return <Spinner />;
  }
  return <Redirect to={`${path}${search}${hash}`} />;
}

function App() {
  return (
    <BrowserRouter>
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
            <Route path="/manual(.html)?">
              <Redirect to="/std/manual.md" />
            </Route>
            <Route path="/style_guide(.html)?">
              <Redirect to="/std/style_guide.md" />
            </Route>
            <Route path="/std@:stdVersion/:stdPath" component={Registry} />
            <Route path="/std@:stdVersion" component={Registry} />
            <Route path="/x/:mod@:modVersion/:modPath" component={Registry} />
            <Route path="/x/:mod@:modVersion" component={Registry} />
            <Route path="/std/:stdPath" component={AddRef} />
            <Route path="/std" component={AddRef} />
            <Route path="/x/:mod/:modPath" component={AddRef} />
            <Route path="/x/:mod" component={AddRef} />
            <Route
              path="/x/"
              render={() => (
                <Suspense fallback={<Spinner />}>
                  <RegistryIndex />
                </Suspense>
              )}
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
    </BrowserRouter>
  );
}

export default App;
