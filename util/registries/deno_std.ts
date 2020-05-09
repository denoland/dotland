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

export class DenoStdRegistry implements Registry<DenoStdEntry> {
  getSourceURL(_entry: DenoStdEntry, path: string, version?: string): string {
    return github.getSourceURL(
      stdEntry,
      path,
      version ? `std/${version.replace(/^v/, "")}` : undefined
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
      version ? `std/${version.replace(/^v/, "")}` : undefined
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
      version ? `std/${version.replace(/^v/, "")}` : undefined
    );
  }
  async getVersionList(_entry: DenoStdEntry): Promise<string[] | null> {
    return stdVersions;
  }
}

export const denoStd = new DenoStdRegistry();
