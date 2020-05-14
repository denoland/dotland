import { NPMEntry, NPMDatabaseEntry } from "./npm";
import "isomorphic-unfetch";

/* eslint-env jest */

const testDbEntry: NPMDatabaseEntry = {
  type: "npm",
  desc: "A entry for testing",
  package: "example",
};
const testEntry = new NPMEntry(testDbEntry);

test("source url", () => {
  expect(testEntry.getSourceURL("/index.js", "1.0.0")).toEqual(
    "https://unpkg.com/example@1.0.0/index.js"
  );
});

test("source url with default version", () => {
  expect(testEntry.getSourceURL("/index.js", undefined)).toEqual(
    "https://unpkg.com/example@latest/index.js"
  );
});

test("source url with empty path", () => {
  expect(testEntry.getSourceURL("", "1.0.0")).toEqual(
    "https://unpkg.com/example@1.0.0"
  );
});

test("source url with subdirectory", () => {
  expect(
    new NPMEntry({ ...testDbEntry, path: "/test" }).getSourceURL(
      "/index.js",
      "1.0.0"
    )
  ).toEqual("https://unpkg.com/example@1.0.0/test/index.js");
});

test("repo url", () => {
  expect(testEntry.getRepositoryURL("/index.js", "1.0.0")).toEqual(
    "https://unpkg.com/browse/example@1.0.0/index.js"
  );
});

test("repo url with default version", () => {
  expect(testEntry.getRepositoryURL("/index.js", undefined)).toEqual(
    "https://unpkg.com/browse/example@latest/index.js"
  );
});

test("repo url with empty path", () => {
  expect(testEntry.getRepositoryURL("", "1.0.0")).toEqual(
    "https://unpkg.com/browse/example@1.0.0/"
  );
});

test("repo url with subdirectory", () => {
  expect(
    new NPMEntry({ ...testDbEntry, path: "/test" }).getRepositoryURL(
      "/index.js",
      "1.0.0"
    )
  ).toEqual("https://unpkg.com/browse/example@1.0.0/test/index.js");
});

test("directory listing", async () => {
  expect(await testEntry.getDirectoryListing("", "0.0.0")).toEqual([
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
  expect(await testEntry.getVersionList()).toEqual(["0.0.0"]);
});
