import db from "../database.json";
import { GithubDatabaseEntry } from "./registries/github";
import { DenoStdDatabaseEntry } from "./registries/deno_std";
import { NPMDatabaseEntry } from "./registries/npm";
import { URLDatabaseEntry } from "./registries/url";

/* eslint-env jest */

const DATABASE: {
  [name: string]: GithubDatabaseEntry &
    DenoStdDatabaseEntry &
    NPMDatabaseEntry &
    URLDatabaseEntry;
} = db as any;

test("each database entry should have a description", () => {
  for (const key in DATABASE) {
    const entry = DATABASE[key];
    expect(entry.desc).toBeTruthy();
  }
});

test("a database entry of type github should have a owner and repo", () => {
  for (const key in DATABASE) {
    const entry = DATABASE[key];
    if (entry.type == "github") {
      expect(entry.owner).toBeTruthy();
      expect(entry.repo).toBeTruthy();
    }
  }
});

test("a database entry should never have a path ending with /", () => {
  for (const key in DATABASE) {
    const entry = DATABASE[key];
    if (entry.path) {
      expect(entry.path.endsWith("/")).toBeFalsy();
    }
  }
});

test("database names with dashes are not allowed", () => {
  for (const key in DATABASE) {
    expect(key.includes("-")).toBeFalsy();
  }
});

test("database entries should be sorted alphabetically", () => {
  const sortedNames = Object.keys(DATABASE).sort();
  expect(sortedNames).toEqual(Object.keys(DATABASE));
});

test("a database path (if any) should start with a trailing slash", () => {
  const invalidEntries = Object.entries(DATABASE).filter(
    ([_, value]) => value.path !== undefined && !value.path?.startsWith("/")
  );
  expect(invalidEntries).toEqual([]);
});
