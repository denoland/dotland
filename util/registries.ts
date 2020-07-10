/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

export interface DatabaseEntry {
  desc: string;
}

export interface Entry extends DatabaseEntry {
  getSourceURL(path: string, version?: string): string;
  getRepositoryURL(path: string, version?: string): string;
  getDirectoryListing(
    path: string,
    version?: string
  ): Promise<DirEntry[] | null>;
  getVersionList(): Promise<string[] | null>;
  getDefaultVersion(): string;
}

export interface DirEntry {
  name: string;
  type: "file" | "dir" | "symlink";
  size?: number;
  target?: string;
}
