/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

export interface Entry {
  desc: string;
}

export interface DirEntry {
  name: string;
  type: "file" | "dir" | "symlink";
  size?: number;
  target?: string;
}

export interface Registry<T extends Entry> {
  getSourceURL(entry: T, path: string, version?: string): string;
  getRepositoryURL(entry: T, path: string, version?: string): string;
  getDirectoryListing(
    entry: T,
    path: string,
    version?: string
  ): Promise<DirEntry[] | null>;
  getVersionList(entry: T): Promise<string[] | null>;
  getDefaultVersion(entry: T): string;
}
