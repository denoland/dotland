/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import { Entry, Registry, DirEntry } from "../registries";
import { GithubEntry, github } from "./github";

import stdVersions from "../../deno_std_versions.json";

export interface DenoStdEntry extends Entry {
  type: "deno_std";
}

const stdEntry: GithubEntry = {
  type: "github",
  owner: "denoland",
  repo: "deno",
  path: "/std",
  desc: "",
};

function stdVersion(version?: string): string | undefined {
  if (version?.match(/^v?\d+\.\d+\.\d+$/)) {
    return `std/${version.replace(/^v/, "")}`;
  }
  return version;
}

export class DenoStdRegistry implements Registry<DenoStdEntry> {
  getSourceURL(_entry: DenoStdEntry, path: string, version?: string): string {
    return github.getSourceURL(
      stdEntry,
      path,
      version ? stdVersion(version) : undefined
    );
  }
  getRepositoryURL(
    _entry: DenoStdEntry,
    path: string,
    version?: string
  ): string {
    return github.getRepositoryURL(
      stdEntry,
      path,
      version ? stdVersion(version) : undefined
    );
  }
  getDirectoryListing(
    _entry: DenoStdEntry,
    path: string,
    version?: string
  ): Promise<DirEntry[] | null> {
    return github.getDirectoryListing(
      stdEntry,
      path,
      version ? stdVersion(version) : undefined
    );
  }
  async getVersionList(_entry: DenoStdEntry): Promise<string[] | null> {
    return stdVersions;
  }
}

export const denoStd = new DenoStdRegistry();
