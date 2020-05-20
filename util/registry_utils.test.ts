import { findEntry } from "./registry_utils";
import { DenoStdEntry } from "./registries/deno_std";
import { NPMEntry } from "./registries/npm";
import { GithubEntry } from "./registries/github";

/* eslint-env jest */

test("find 'std' in database", () => {
  expect(findEntry("std")).toEqual(
    new DenoStdEntry({
      type: "deno_std",
      desc: "Deno Standard Modules",
    })
  );
});

test("Resolve virtual 'gh:owner:repo'", () => {
  expect(findEntry("gh:owner:repo")).toEqual(
    new GithubEntry({
      type: "github",
      desc: "owner/repo",
      owner: "owner",
      repo: "repo",
    })
  );
});

test("Resolve virtual 'npm:package'", () => {
  expect(findEntry("npm:package")).toEqual(
    new NPMEntry({
      type: "npm",
      desc: "package",
      package: "package",
    })
  );
});
