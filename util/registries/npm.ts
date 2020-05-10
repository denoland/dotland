/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import { Entry, Registry, DirEntry } from "../registries";

export interface NPMEntry extends Entry {
  type: "npm";
  package: string;
  path?: string;
}

export class NPMRegistry implements Registry<NPMEntry> {
  getSourceURL(entry: NPMEntry, path: string, version?: string): string {
    return `https://unpkg.com/${entry.package}@${version ?? "latest"}${
      entry.path ?? ""
    }${path}`;
  }
  getRepositoryURL(entry: NPMEntry, path: string, version?: string): string {
    return `https://unpkg.com/browse/${entry.package}@${version ?? "latest"}${
      entry.path ?? ""
    }${path || "/"}`;
  }
  async getDirectoryListing(
    entry: NPMEntry,
    path: string,
    version?: string
  ): Promise<DirEntry[] | null> {
    const url = `https://unpkg.com/${entry.package}@${version ?? "latest"}${
      entry.path ?? ""
    }${path}/?meta`;
    const res = await fetch(url, {
      headers: {
        accept: "application/json",
      },
    });
    if (res.status !== 200) {
      throw Error(
        `Got an error (${
          res.status
        }) while querying unpkg:\n${await res.text()}`
      );
    }
    const data = await res.json();
    if (data.type !== "directory") {
      return null;
    }
    const prefix = (data.path === "/" ? "" : data.path) + "/";
    const files: DirEntry[] = data.files.map((file: any) => {
      return {
        name: file.path?.substring(prefix.length),
        type: file.type === "directory" ? "dir" : file.type, // "file" | "dir"
        size: file.size, // file only
      };
    });
    return files;
  }
  async getVersionList(entry: NPMEntry): Promise<string[] | null> {
    const url = `https://${
      process ? "" : "cors-anywhere.herokuapp.com/"
    }registry.npmjs.org/${entry.package}`;
    const res = await fetch(url, {
      headers: {
        accept: "application/vnd.npm.install-v1+json",
      },
    });
    if (res.status !== 200) {
      throw Error(
        `Got an error (${
          res.status
        }) while querying the NPM registry API:\n${await res.text()}`
      );
    }
    const data = await res.json();
    const tags: string[] | undefined = data
      ? Object.keys(data.versions).reverse()
      : [];
    return tags ?? null;
  }
  getDefaultVersion(_entry: NPMEntry): string {
    return "latest";
  }
}

export const npm = new NPMRegistry();
