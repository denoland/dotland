import React from "react";
import { render } from "@testing-library/react";
// @ts-ignore because @types is not up to date
import { waitFor } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import App from "./App";
/* eslint-env jest */

test("/x/std redirects to /x/std/", async () => {
  const history = createMemoryHistory();
  history.push("/x/std");
  const { getByText } = render(
    <Router history={history}>
      <App />
    </Router>
  );
  await waitFor(() => expect(history.location.pathname).toEqual("/x/std/"));
  await waitFor(() => expect(getByText("Deno Standard Modules")).toBeTruthy());
});

test("/std redirects to /std/", async () => {
  const history = createMemoryHistory();
  history.push("/std");
  const { getByText } = render(
    <Router history={history}>
      <App />
    </Router>
  );
  await waitFor(() => expect(history.location.pathname).toEqual("/std/"));
  await waitFor(() => expect(getByText("Deno Standard Modules")).toBeTruthy());
});

test("/std/bytes redirects to /std/bytes/", async () => {
  const history = createMemoryHistory();
  history.push("/std/bytes");
  const { getByText } = render(
    <Router history={history}>
      <App />
    </Router>
  );
  await waitFor(() => expect(history.location.pathname).toEqual("/std/bytes/"));
  await waitFor(() => expect(getByText("mod.ts")).toBeTruthy());
  expect(getByText("test.ts")).toBeTruthy();
});
