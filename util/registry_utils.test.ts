import { findEntry } from "./registry_utils";
import { DenoStdEntry } from "./registries/deno_std";

/* eslint-env jest */

test("find 'std' in database", () => {
  expect(findEntry("std")).toEqual(
    new DenoStdEntry({
      type: "deno_std",
      desc: "Deno Standard Modules",
    })
  );
});
