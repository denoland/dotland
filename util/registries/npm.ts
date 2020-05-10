/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import { Entry, DirEntry, DatabaseEntry } from "../registries";

export interface NPMDatabaseEntry extends DatabaseEntry {
  type: "npm";
  desc: string;
  package: string;
  path?: string;
}

export class NPMEntry implements Entry {
  public desc: string;
  private package_: string;
  private path?: string;

  constructor(databaseEntry: NPMDatabaseEntry) {
    this.desc = databaseEntry.desc;
    this.package_ = databaseEntry.package;
    this.path = databaseEntry.path;
  }

  getSourceURL(path: string, version?: string): string {
    return `https://unpkg.com/${this.package_}@${version ?? "latest"}${
      this.path ?? ""
    }${path}`;
  }
  getRepositoryURL(path: string, version?: string): string {
    return `https://unpkg.com/browse/${this.package_}@${version ?? "latest"}${
      this.path ?? ""
    }${path || "/"}`;
  }
  async getDirectoryListing(
    path: string,
    version?: string
  ): Promise<DirEntry[] | null> {
    const url = `https://unpkg.com/${this.package_}@${version ?? "latest"}${
      this.path ?? ""
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
  async getVersionList(): Promise<string[] | null> {
    const url = `https://${
      process ? "" : "cors-anywhere.herokuapp.com/"
    }registry.npmjs.org/${this.package_}`;
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
  getDefaultVersion(): string {
    return "latest";
  }
}
