import React from "react";
import { render } from "@testing-library/react";

import App from "./App";

test("app contains deno", () => {
  const { getByText } = render(<App />, );
  expect(getByText("Deno")).toBeTruthy();
});
