import DATABASE from "../database";
import type { DatabaseEntry } from "./registry_utils";
import { GithubDatabaseEntry } from "./registries/github";
import { NPMDatabaseEntry } from "./registries/npm";

/* eslint-env jest */

function hasPath(
  entry: DatabaseEntry
): entry is GithubDatabaseEntry | NPMDatabaseEntry {
  return "path" in entry && entry.path !== undefined;
}

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
    if (hasPath(entry)) {
      expect(entry.path?.endsWith("/")).toBeFalsy();
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
    ([_, value]) => hasPath(value) && !value.path?.startsWith("/")
  );
  expect(invalidEntries).toEqual([]);
});
