import { find } from "./registry_utils";

/* eslint-env jest */

test("find 'std' in database", () => {
  expect(find("std")).toEqual({
    type: "deno_std",
    desc: "Deno Standard Modules",
  });
});
