import DATABASE from "./database.json";
import { getEntry } from "./registry_utils";

test("check that the registry correctly handles std module", () => {
  expect(DATABASE["std"]).toBeTruthy();
  const entry = getEntry("std");
  expect(entry).toBeTruthy();
  expect(entry.name).toBe("std");
  expect(entry.branch).toBe("master");
  expect(entry.raw).toEqual(DATABASE["std"]);
  expect(entry.type).toBe("github");
  expect(entry.url).toBe(
    "https://raw.githubusercontent.com/denoland/deno/master/std/"
  );
  expect(entry.repo).toBe(
    "https://github.com/denoland/deno/tree/master/std/"
  );
});

test("check that the registry correctly handles non existing module", () => {
  const entry = getEntry("this-module-does-not-exist");
  expect(entry).toBeNull();
});
