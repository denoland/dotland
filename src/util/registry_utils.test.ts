import DATABASE from "../database.json";
import { proxy, getEntry } from "./registry_utils";

test("check that the registry correctly handles std module", async () => {
  expect(DATABASE["std"]).toBeTruthy();
  const entry = await getEntry("std");
  expect(entry).toBeTruthy();
  expect(entry.name).toBe("std");
  expect(entry.branch).toMatch(/v\d+\.\d+\.\d+/);
  expect(entry.raw).toEqual(DATABASE["std"]);
  expect(entry.type).toBe("github");
  expect(entry.url).toBe(
    `https://raw.githubusercontent.com/denoland/deno/${entry.branch}/std/`
  );
  expect(entry.repo).toBe(
    `https://github.com/denoland/deno/tree/${entry.branch}/std/`
  );
});

test("check that the registry correctly handles non existing module", async () => {
  const entry = await getEntry("this-module-does-not-exist");
  expect(entry).toBeNull();
});

test("proxy1", async () => {
  const { entry, path } = await proxy("/x/install/foo/bar.js");
  expect(entry).toBeTruthy();
  expect(entry.name).toBe("install");
  expect(entry.branch).toBeTruthy();
  expect(entry.raw).toEqual(DATABASE["install"]);
  expect(entry.type).toBe("github");
  expect(entry.url).toBe(
    `https://raw.githubusercontent.com/denoland/deno_install/${entry.branch}/`
  );
  expect(entry.repo).toBe(
    `https://github.com/denoland/deno_install/tree/${entry.branch}/`
  );
  expect(path).toBe("foo/bar.js");
});

test("proxy2", async () => {
  const r = await proxy("/x/install@v0.1.2/foo/bar.js");
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
