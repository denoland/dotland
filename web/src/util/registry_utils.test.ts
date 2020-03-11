import DATABASE from "../database.json";
import { proxy, getEntry } from "./registry_utils";
/* eslint-env jest */

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
  expect(entry.repo).toBe("https://github.com/denoland/deno/tree/master/std/");
});

test("check that the registry correctly handles non existing module", () => {
  const entry = getEntry("this-module-does-not-exist");
  expect(entry).toBeNull();
});

test("proxy1", () => {
  const r = proxy("/x/install/foo/bar.js");
  expect(r).toEqual({
    entry: {
      name: "install",
      branch: "master",
      type: "github",
      raw: {
        type: "github",
        owner: "denoland",
        repo: "deno_install",
        desc: "One-line commands to install Deno on your system."
      },
      url: "https://raw.githubusercontent.com/denoland/deno_install/master/",
      repo: "https://github.com/denoland/deno_install/tree/master/"
    },
    path: "foo/bar.js"
  });
});

test("proxy2", () => {
  const r = proxy("/x/install@v0.1.2/foo/bar.js");
  expect(r).toEqual({
    entry: {
      name: "install",
      branch: "v0.1.2",
      type: "github",
      raw: {
        type: "github",
        owner: "denoland",
        repo: "deno_install",
        desc: "One-line commands to install Deno on your system."
      },
      url: "https://raw.githubusercontent.com/denoland/deno_install/v0.1.2/",
      repo: "https://github.com/denoland/deno_install/tree/v0.1.2/"
    },
    path: "foo/bar.js"
  });
});
