/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import { Entry, Registry } from "../registries";

export interface URLEntry extends Entry {
  type: "url";
  url: string;
  repo: string;
  default_version: string;
}

export class URLRegistry implements Registry<URLEntry> {
  getSourceURL(entry: URLEntry, path: string, version?: string): string {
    return entry.url
      .replace(/\$\{v}/, version ?? entry.default_version)
      .replace(/\$\{p}/, path);
  }
  getRepositoryURL(entry: URLEntry, path: string, version?: string): string {
    return entry.repo
      .replace(/\$\{v}/, version ?? entry.default_version)
      .replace(/\$\{p}/, path);
  }
  async getDirectoryListing(
    _entry: URLEntry,
    _path: string,
    _version?: string
  ): Promise<null> {
    return null;
  }
  async getVersionList(_entry: URLEntry): Promise<string[] | null> {
    return null;
  }
}

export const url = new URLRegistry();
