import { denoStd, DenoStdEntry } from "./deno_std";
import "isomorphic-unfetch";

import denoStdVersions from "../../deno_std_versions.json";

/* eslint-env jest */

const testEntry: DenoStdEntry = {
  type: "deno_std",
  desc: "A entry for testing",
};

test("source url", () => {
  expect(denoStd.getSourceURL(testEntry, "/index.js", "0.50.0")).toEqual(
    "https://raw.githubusercontent.com/denoland/deno/std/0.50.0/std/index.js"
  );
});

test("source url with commit hash", () => {
  expect(denoStd.getSourceURL(testEntry, "/index.js", "a1cd4f")).toEqual(
    "https://raw.githubusercontent.com/denoland/deno/a1cd4f/std/index.js"
  );
});

test("source url with default version", () => {
  expect(denoStd.getSourceURL(testEntry, "/index.js", undefined)).toEqual(
    "https://raw.githubusercontent.com/denoland/deno/master/std/index.js"
  );
});

test("source url with empty path", () => {
  expect(denoStd.getSourceURL(testEntry, "", "0.50.0")).toEqual(
    "https://raw.githubusercontent.com/denoland/deno/std/0.50.0/std"
  );
});

test("repo url", () => {
  expect(denoStd.getRepositoryURL(testEntry, "/index.js", "0.50.0")).toEqual(
    "https://github.com/denoland/deno/tree/std/0.50.0/std/index.js"
  );
});

test("repo url with commit hash", () => {
  expect(denoStd.getRepositoryURL(testEntry, "/index.js", "a1cd4f")).toEqual(
    "https://github.com/denoland/deno/tree/a1cd4f/std/index.js"
  );
});

test("repo url with default version", () => {
  expect(denoStd.getRepositoryURL(testEntry, "/index.js", undefined)).toEqual(
    "https://github.com/denoland/deno/tree/master/std/index.js"
  );
});

test("repo url with empty path", () => {
  expect(denoStd.getRepositoryURL(testEntry, "", "0.50.0")).toEqual(
    "https://github.com/denoland/deno/tree/std/0.50.0/std"
  );
});

test("version list", async () => {
  expect(await denoStd.getVersionList(testEntry)).toEqual(denoStdVersions);
});
