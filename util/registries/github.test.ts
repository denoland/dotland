import { GithubDatabaseEntry, GithubEntry } from "./github";
import "isomorphic-unfetch";

/* eslint-env jest */

const testDbEntry: GithubDatabaseEntry = {
  type: "github",
  desc: "A entry for testing",
  owner: "octocat",
  repo: "test-repo1",
};
const testEntry = new GithubEntry(testDbEntry);

test("source url", () => {
  expect(testEntry.getSourceURL("/index.js", "1.0")).toEqual(
    "https://raw.githubusercontent.com/octocat/test-repo1/1.0/index.js"
  );
});

test("source url with default version", () => {
  expect(testEntry.getSourceURL("/index.js", undefined)).toEqual(
    "https://raw.githubusercontent.com/octocat/test-repo1/master/index.js"
  );
});

test("source url with custom default version", () => {
  expect(
    new GithubEntry({
      ...testDbEntry,
      // eslint-disable-next-line @typescript-eslint/camelcase
      default_version: "custom",
    }).getRepositoryURL("/index.js", undefined)
  ).toEqual("https://github.com/octocat/test-repo1/tree/custom/index.js");
});

test("source url with empty path", () => {
  expect(testEntry.getSourceURL("", "1.0")).toEqual(
    "https://raw.githubusercontent.com/octocat/test-repo1/1.0"
  );
});

test("source url with subdirectory", () => {
  expect(
    new GithubEntry({
      ...testDbEntry,
      path: "/test",
    }).getSourceURL("/index.js", "1.0")
  ).toEqual(
    "https://raw.githubusercontent.com/octocat/test-repo1/1.0/test/index.js"
  );
});

test("repo url", () => {
  expect(testEntry.getRepositoryURL("/index.js", "1.0")).toEqual(
    "https://github.com/octocat/test-repo1/tree/1.0/index.js"
  );
});

test("repo url with default version", () => {
  expect(testEntry.getRepositoryURL("/index.js", undefined)).toEqual(
    "https://github.com/octocat/test-repo1/tree/master/index.js"
  );
});

test("repo url with custom default version", () => {
  expect(
    new GithubEntry({
      ...testDbEntry,
      // eslint-disable-next-line @typescript-eslint/camelcase
      default_version: "custom",
    }).getRepositoryURL("/index.js", undefined)
  ).toEqual("https://github.com/octocat/test-repo1/tree/custom/index.js");
});

test("repo url with empty path", () => {
  expect(testEntry.getRepositoryURL("", "1.0")).toEqual(
    "https://github.com/octocat/test-repo1/tree/1.0"
  );
});

test("repo url with subdirectory", () => {
  expect(
    new GithubEntry({
      ...testDbEntry,
      path: "/test",
    }).getRepositoryURL("/index.js", "1.0")
  ).toEqual("https://github.com/octocat/test-repo1/tree/1.0/test/index.js");
});

test("directory listing", async () => {
  expect(await testEntry.getDirectoryListing("", "1.0")).toEqual([
    {
      name: "2015-04-12-test-post-last-year.md",
      size: 171,
      target: undefined,
      type: "file",
    },
    {
      name: "2016-02-24-first-post.md",
      size: 287,
      target: undefined,
      type: "file",
    },
    {
      name: "2016-02-26-sample-post-jekyll.md",
      size: 1041,
      target: undefined,
      type: "file",
    },
  ]);
});

test("version list", async () => {
  expect(await testEntry.getVersionList()).toEqual(["2.0", "1.0"]);
});
