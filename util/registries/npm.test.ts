import { npm, NPMEntry } from "./npm";
import "isomorphic-unfetch";

/* eslint-env jest */

const testEntry: NPMEntry = {
  type: "npm",
  desc: "A entry for testing",
  package: "example",
};

test("source url", () => {
  expect(npm.getSourceURL(testEntry, "/index.js", "1.0.0")).toEqual(
    "https://unpkg.com/example@1.0.0/index.js"
  );
});

test("source url with default version", () => {
  expect(npm.getSourceURL(testEntry, "/index.js", undefined)).toEqual(
    "https://unpkg.com/example@latest/index.js"
  );
});

test("source url with empty path", () => {
  expect(npm.getSourceURL(testEntry, "", "1.0.0")).toEqual(
    "https://unpkg.com/example@1.0.0"
  );
});

test("source url with subdirectory", () => {
  expect(
    npm.getSourceURL({ ...testEntry, path: "/test" }, "/index.js", "1.0.0")
  ).toEqual("https://unpkg.com/example@1.0.0/test/index.js");
});

test("repo url", () => {
  expect(npm.getRepositoryURL(testEntry, "/index.js", "1.0.0")).toEqual(
    "https://unpkg.com/browse/example@1.0.0/index.js"
  );
});

test("repo url with default version", () => {
  expect(npm.getRepositoryURL(testEntry, "/index.js", undefined)).toEqual(
    "https://unpkg.com/browse/example@latest/index.js"
  );
});

test("repo url with empty path", () => {
  expect(npm.getRepositoryURL(testEntry, "", "1.0.0")).toEqual(
    "https://unpkg.com/browse/example@1.0.0/"
  );
});

test("repo url with subdirectory", () => {
  expect(
    npm.getRepositoryURL({ ...testEntry, path: "/test" }, "/index.js", "1.0.0")
  ).toEqual("https://unpkg.com/browse/example@1.0.0/test/index.js");
});

test("directory listing", async () => {
  expect(await npm.getDirectoryListing(testEntry, "", "0.0.0")).toEqual([
    {
      name: "package.json",
      size: 291,
      type: "file",
    },
    {
      name: "github.js",
      size: 886,
      type: "file",
    },
  ]);
});

test("version list", async () => {
  expect(await npm.getVersionList(testEntry)).toEqual(["0.0.0"]);
});
