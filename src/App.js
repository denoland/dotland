import React from "react";
import "./App.css";
import Manual from "./Manual";
import Home from "./Home";
import { Container } from "@material-ui/core";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Container>
        <Switch>
          <Route path="/manual">
            <Manual />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Container>
    </Router>
  );
}

export default App;
