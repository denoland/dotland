import { github, GithubEntry } from "./github";
import "isomorphic-unfetch";

/* eslint-env jest */

const testEntry: GithubEntry = {
  type: "github",
  desc: "A entry for testing",
  owner: "octocat",
  repo: "test-repo1",
};

test("source url", () => {
  expect(github.getSourceURL(testEntry, "/index.js", "1.0")).toEqual(
    "https://raw.githubusercontent.com/octocat/test-repo1/1.0/index.js"
  );
});

test("source url with default version", () => {
  expect(github.getSourceURL(testEntry, "/index.js", undefined)).toEqual(
    "https://raw.githubusercontent.com/octocat/test-repo1/master/index.js"
  );
});

test("source url with custom default version", () => {
  expect(
    github.getRepositoryURL(
      {
        ...testEntry,
        // eslint-disable-next-line @typescript-eslint/camelcase
        default_version: "custom",
      },
      "/index.js",
      undefined
    )
  ).toEqual("https://github.com/octocat/test-repo1/tree/custom/index.js");
});

test("source url with empty path", () => {
  expect(github.getSourceURL(testEntry, "", "1.0")).toEqual(
    "https://raw.githubusercontent.com/octocat/test-repo1/1.0"
  );
});

test("source url with subdirectory", () => {
  expect(
    github.getSourceURL({ ...testEntry, path: "/test" }, "/index.js", "1.0")
  ).toEqual(
    "https://raw.githubusercontent.com/octocat/test-repo1/1.0/test/index.js"
  );
});

test("repo url", () => {
  expect(github.getRepositoryURL(testEntry, "/index.js", "1.0")).toEqual(
    "https://github.com/octocat/test-repo1/tree/1.0/index.js"
  );
});

test("repo url with default version", () => {
  expect(github.getRepositoryURL(testEntry, "/index.js", undefined)).toEqual(
    "https://github.com/octocat/test-repo1/tree/master/index.js"
  );
});

test("repo url with custom default version", () => {
  expect(
    github.getRepositoryURL(
      {
        ...testEntry,
        // eslint-disable-next-line @typescript-eslint/camelcase
        default_version: "custom",
      },
      "/index.js",
      undefined
    )
  ).toEqual("https://github.com/octocat/test-repo1/tree/custom/index.js");
});

test("repo url with empty path", () => {
  expect(github.getRepositoryURL(testEntry, "", "1.0")).toEqual(
    "https://github.com/octocat/test-repo1/tree/1.0"
  );
});

test("repo url with subdirectory", () => {
  expect(
    github.getRepositoryURL({ ...testEntry, path: "/test" }, "/index.js", "1.0")
  ).toEqual("https://github.com/octocat/test-repo1/tree/1.0/test/index.js");
});

test("directory listing", async () => {
  expect(await github.getDirectoryListing(testEntry, "", "1.0")).toEqual([
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
  expect(await github.getVersionList(testEntry)).toEqual(["2.0", "1.0"]);
});
