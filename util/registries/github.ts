/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import { Entry, Registry, DirEntry } from "../registries";

export interface GithubEntry extends Entry {
  type: "github";
  owner: string;
  repo: string;
  path?: string;
  default_version?: string;
}

export class GithubRegistry implements Registry<GithubEntry> {
  getSourceURL(entry: GithubEntry, path: string, version?: string): string {
    return `https://raw.githubusercontent.com/${entry.owner}/${entry.repo}/${
      version ?? entry.default_version ?? "master"
    }${entry.path ?? ""}${path}`;
  }
  getRepositoryURL(entry: GithubEntry, path: string, version?: string): string {
    return `https://github.com/${entry.owner}/${entry.repo}/tree/${
      version ?? entry.default_version ?? "master"
    }${entry.path ?? ""}${path}`;
  }
  async getDirectoryListing(
    entry: GithubEntry,
    path: string,
    version?: string
  ): Promise<DirEntry[] | null> {
    const url = `https://api.github.com/repos/${entry.owner}/${
      entry.repo
    }/contents/${entry.path ?? ""}${path}?ref=${
      version ?? entry.default_version ?? "master"
    }`;
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
  }
  async getVersionList(entry: GithubEntry): Promise<string[] | null> {
    const url = `https://api.github.com/repos/${entry.owner}/${entry.repo}/tags`;
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
  getDefaultVersion(entry: GithubEntry): string {
    return entry.default_version ?? "master";
  }
}

export const github = new GithubRegistry();
