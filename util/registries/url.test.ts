import { URLEntry, URLDatabaseEntry } from "./url";

/* eslint-env jest */

const testDbEntry: URLDatabaseEntry = {
  type: "url",
  desc: "A entry for testing",
  repo: "https://repos.example.com/my_package@${v}${p}",
  url: "https://example.com/my_package@${v}${p}",
  // eslint-disable-next-line @typescript-eslint/camelcase
  default_version: "latest",
};
const testEntry = new URLEntry(testDbEntry);

test("source url", () => {
  expect(testEntry.getSourceURL("/index.js", "v1.0.0")).toEqual(
    "https://example.com/my_package@v1.0.0/index.js"
  );
});

test("source url with default version", () => {
  expect(testEntry.getSourceURL("/index.js", undefined)).toEqual(
    "https://example.com/my_package@latest/index.js"
  );
});

test("source url with empty path", () => {
  expect(testEntry.getSourceURL("", "v1.0.0")).toEqual(
    "https://example.com/my_package@v1.0.0"
  );
});

test("repo url", () => {
  expect(testEntry.getRepositoryURL("/index.js", "v1.0.0")).toEqual(
    "https://repos.example.com/my_package@v1.0.0/index.js"
  );
});

test("repo url default version", () => {
  expect(testEntry.getRepositoryURL("/index.js", undefined)).toEqual(
    "https://repos.example.com/my_package@latest/index.js"
  );
});

test("repo url with empty path", () => {
  expect(testEntry.getRepositoryURL("", "v1.0.0")).toEqual(
    "https://repos.example.com/my_package@v1.0.0"
  );
});

test("directory listing", async () => {
  expect(await testEntry.getDirectoryListing("/index.js", "v1.0.0")).toBeNull();
});

test("version list", async () => {
  expect(await testEntry.getVersionList()).toBeNull();
});
