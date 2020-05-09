import { url, URLEntry } from "./url";

/* eslint-env jest */

const testEntry: URLEntry = {
  type: "url",
  desc: "A entry for testing",
  repo: "https://repos.example.com/my_package@${v}${p}",
  url: "https://example.com/my_package@${v}${p}",
  // eslint-disable-next-line @typescript-eslint/camelcase
  default_version: "latest",
};

test("source url", () => {
  expect(url.getSourceURL(testEntry, "/index.js", "v1.0.0")).toEqual(
    "https://example.com/my_package@v1.0.0/index.js"
  );
});

test("source url with default version", () => {
  expect(url.getSourceURL(testEntry, "/index.js", undefined)).toEqual(
    "https://example.com/my_package@latest/index.js"
  );
});

test("source url with empty path", () => {
  expect(url.getSourceURL(testEntry, "", "v1.0.0")).toEqual(
    "https://example.com/my_package@v1.0.0"
  );
});

test("repo url", () => {
  expect(url.getRepositoryURL(testEntry, "/index.js", "v1.0.0")).toEqual(
    "https://repos.example.com/my_package@v1.0.0/index.js"
  );
});

test("repo url default version", () => {
  expect(url.getRepositoryURL(testEntry, "/index.js", undefined)).toEqual(
    "https://repos.example.com/my_package@latest/index.js"
  );
});

test("repo url with empty path", () => {
  expect(url.getRepositoryURL(testEntry, "", "v1.0.0")).toEqual(
    "https://repos.example.com/my_package@v1.0.0"
  );
});

test("directory listing", async () => {
  expect(
    await url.getDirectoryListing(testEntry, "/index.js", "v1.0.0")
  ).toBeNull();
});

test("version list", async () => {
  expect(await url.getVersionList(testEntry)).toBeNull();
});
