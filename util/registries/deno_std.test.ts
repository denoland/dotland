import { DenoStdEntry, DenoStdDatabaseEntry } from "./deno_std";
import "isomorphic-unfetch";

import denoStdVersions from "../../deno_std_versions.json";

/* eslint-env jest */

const testDbEntry: DenoStdDatabaseEntry = {
  type: "deno_std",
  desc: "A entry for testing",
};
const testEntry = new DenoStdEntry(testDbEntry);

test("source url", () => {
  expect(testEntry.getSourceURL("/index.js", "0.50.0")).toEqual(
    "https://raw.githubusercontent.com/denoland/deno/std/0.50.0/std/index.js"
  );
});

test("source url with commit hash", () => {
  expect(testEntry.getSourceURL("/index.js", "a1cd4f")).toEqual(
    "https://raw.githubusercontent.com/denoland/deno/a1cd4f/std/index.js"
  );
});

test("source url with default version", () => {
  expect(testEntry.getSourceURL("/index.js", undefined)).toEqual(
    "https://raw.githubusercontent.com/denoland/deno/master/std/index.js"
  );
});

test("source url with empty path", () => {
  expect(testEntry.getSourceURL("", "0.50.0")).toEqual(
    "https://raw.githubusercontent.com/denoland/deno/std/0.50.0/std"
  );
});

test("repo url", () => {
  expect(testEntry.getRepositoryURL("/index.js", "0.50.0")).toEqual(
    "https://github.com/denoland/deno/tree/std/0.50.0/std/index.js"
  );
});

test("repo url with commit hash", () => {
  expect(testEntry.getRepositoryURL("/index.js", "a1cd4f")).toEqual(
    "https://github.com/denoland/deno/tree/a1cd4f/std/index.js"
  );
});

test("repo url with default version", () => {
  expect(testEntry.getRepositoryURL("/index.js", undefined)).toEqual(
    "https://github.com/denoland/deno/tree/master/std/index.js"
  );
});

test("repo url with empty path", () => {
  expect(testEntry.getRepositoryURL("", "0.50.0")).toEqual(
    "https://github.com/denoland/deno/tree/std/0.50.0/std"
  );
});

test("version list", async () => {
  expect(await testEntry.getVersionList()).toEqual(denoStdVersions);
});
