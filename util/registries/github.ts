/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import { Entry, DirEntry, DatabaseEntry } from "../registries";

export interface GithubDatabaseEntry extends DatabaseEntry {
  type: "github";
  owner: string;
  repo: string;
  path?: string;
  default_version?: string;
}

export class GithubEntry implements Entry {
  public desc: string;
  private owner: string;
  private repo: string;
  private path?: string;
  private defaultVersion?: string;

  constructor(databaseEntry: GithubDatabaseEntry) {
    this.desc = databaseEntry.desc;
    this.owner = databaseEntry.owner;
    this.repo = databaseEntry.repo;
    this.path = databaseEntry.path;
    this.defaultVersion = databaseEntry.default_version;
  }

  getSourceURL(path: string, version?: string): string {
    return `https://raw.githubusercontent.com/${this.owner}/${this.repo}/${
      version ?? this.defaultVersion ?? "master"
    }${this.path ?? ""}${path}`;
  }
  getRepositoryURL(path: string, version?: string): string {
    return `https://github.com/${this.owner}/${this.repo}/tree/${
      version ?? this.defaultVersion ?? "master"
    }${this.path ?? ""}${path}`;
  }
  async getDirectoryListing(
    path: string,
    version?: string
  ): Promise<DirEntry[] | null> {
    try {
      const url = `https://api.github.com/repos/${this.owner}/${
        this.repo
      }/contents/${this.path ?? ""}${path}?ref=${
        version ?? this.defaultVersion ?? "master"
      }`;
      const res = await fetch(url, {
        headers: {
          accept: "application/vnd.github.v3.object",
        },
      });
      if (res.status === 404) return null;
      if (res.status !== 200) {
        throw Error(
          `Got an error (${
            res.status
          }) while querying the GitHub API:\n${await res.text()}`
        );
      }
      const data = await res.json();
      if (data.type !== "dir") {
        return null;
      }
      const files: DirEntry[] = data.entries.map((entry: any) => ({
        name: entry.name,
        type: entry.type, // "file" | "dir" | "symlink"
        size: entry.size, // file only
        target: entry.target, // symlink only
      }));
      return files;
    } catch (e) {
      if (e.toString().includes("Failed to fetch")) {
        throw Error(
          "Querying the GitHub API failed. This is usually caused by a network outage or because you have reached your hourly API rate limit of 60 requests."
        );
      }
      throw e;
    }
  }
  async getVersionList(): Promise<string[] | null> {
    const url = `https://api.github.com/repos/${this.owner}/${this.repo}/tags`;
    const res = await fetch(url, {
      headers: {
        accept: "application/vnd.github.v3.object",
      },
    });
    if (res.status !== 200) {
      throw Error(
        `Got an error (${
          res.status
        }) while querying the GitHub API:\n${await res.text()}`
      );
    }
    const data: any[] = await res.json();
    const tags: string[] | undefined = data?.map((tag: any) => tag.name);
    return tags ?? null;
  }
  getDefaultVersion(): string {
    return this.defaultVersion ?? "master";
  }
}
