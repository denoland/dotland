/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import { Entry, DirEntry, DatabaseEntry } from "../registries";
import { GithubEntry } from "./github";

import stdVersions from "../../deno_std_versions.json";

export interface DenoStdDatabaseEntry extends DatabaseEntry {
  type: "deno_std";
}

const stdEntry = new GithubEntry({
  type: "github",
  owner: "denoland",
  repo: "deno",
  path: "/std",
  desc: "",
});

function stdVersion(version?: string): string | undefined {
  if (version?.match(/^v?\d+\.\d+\.\d+(-.*)?$/)) {
    return `std/${version.replace(/^v/, "")}`;
  }
  return version;
}

export class DenoStdEntry implements Entry {
  public desc: string;

  constructor(databaseEntry: DenoStdDatabaseEntry) {
    this.desc = databaseEntry.desc;
  }

  getSourceURL(path: string, version?: string): string {
    return stdEntry.getSourceURL(
      path,
      version ? stdVersion(version) : undefined
    );
  }
  getRepositoryURL(path: string, version?: string): string {
    return stdEntry.getRepositoryURL(
      path,
      version ? stdVersion(version) : undefined
    );
  }
  getDirectoryListing(
    path: string,
    version?: string
  ): Promise<DirEntry[] | null> {
    return stdEntry.getDirectoryListing(
      path,
      version ? stdVersion(version) : undefined
    );
  }
  async getVersionList(): Promise<string[] | null> {
    return stdVersions;
  }
  getDefaultVersion(): string {
    return "master";
  }
}
