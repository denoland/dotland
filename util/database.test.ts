import db from "../database.json";
import { URLEntry } from "./registries/url";
import { GithubEntry } from "./registries/github";
import { DenoStdEntry } from "./registries/deno_std";
/* eslint-env jest */

const DATABASE: {
  [str: string]: URLEntry & GithubEntry & DenoStdEntry;
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
