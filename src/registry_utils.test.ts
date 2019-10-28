import DATABASE from "./database.json";
import { getEntry } from "./registry_utils";

test("check that the registry correctly handles std module", () => {
  expect(DATABASE["std"]).toBeTruthy();
  const entry = getEntry("std");
  expect(entry).toBeTruthy();
  expect(entry.name).toEqual("std");
  expect(entry.branch).toEqual("master");
  expect(entry.raw).toEqual(DATABASE["std"]);
  expect(entry.type).toEqual("github");
  expect(entry.url).toEqual(
    "https://raw.githubusercontent.com/denoland/deno/master/std/"
  );
  expect(entry.repo).toEqual(
    "https://github.com/denoland/deno/tree/master/std/"
  );
});

test("check that the registry correctly handles non existing module", () => {
  const entry = getEntry("this-module-does-not-exist");
  expect(entry).toBeNull();
});
