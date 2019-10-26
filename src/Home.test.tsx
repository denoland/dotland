import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Home from "./Home";

test("contains the word deno", () => {
  const { getByText } = render(<Home />, { wrapper: MemoryRouter });
  expect(getByText("Deno")).toBeTruthy();
});
