// Copyright 2018-2022 the Deno authors. All rights reserved. MIT license.
import { existsSync } from "../../fs/exists.ts";
import { fromFileUrl } from "../path.ts";
import { getOpenOptions } from "./_fs_common.ts";

export type openFlags =
  | "a"
  | "ax"
  | "a+"
  | "ax+"
  | "as"
  | "as+"
  | "r"
  | "r+"
  | "rs+"
  | "w"
  | "wx"
  | "w+"
  | "wx+";

type openCallback = (err: Error | null, fd: number) => void;

function convertFlagAndModeToOptions(
  flag?: openFlags,
  mode?: number,
): Deno.OpenOptions | undefined {
  if (!flag && !mode) return undefined;
  if (!flag && mode) return { mode };
  return { ...getOpenOptions(flag), mode };
}

export function open(path: string | URL, callback: openCallback): void;
export function open(
  path: string | URL,
  flags: openFlags,
  callback: openCallback,
): void;
export function open(
  path: string | URL,
  flags: openFlags,
  mode: number,
  callback: openCallback,
): void;
export function open(
  path: string | URL,
  flagsOrCallback: openCallback | openFlags,
  callbackOrMode?: openCallback | number,
  maybeCallback?: openCallback,
) {
  const flags = typeof flagsOrCallback === "string"
    ? flagsOrCallback
    : undefined;
  const callback = typeof flagsOrCallback === "function"
    ? flagsOrCallback
    : typeof callbackOrMode === "function"
    ? callbackOrMode
    : maybeCallback;
  const mode = typeof callbackOrMode === "number" ? callbackOrMode : undefined;
  path = path instanceof URL ? fromFileUrl(path) : path;

  if (!callback) throw new Error("No callback function supplied");

  if (["ax", "ax+", "wx", "wx+"].includes(flags || "") && existsSync(path)) {
    const err = new Error(`EEXIST: file already exists, open '${path}'`);
    (callback as (err: Error) => void)(err);
  } else {
    if (flags === "as" || flags === "as+") {
      let err: Error | null = null, res: number;
      try {
        res = openSync(path, flags, mode);
      } catch (error) {
        err = error instanceof Error ? error : new Error("[non-error thrown]");
      }
      if (err) {
        (callback as (err: Error) => void)(err);
      } else {
        callback(null, res!);
      }
      return;
    }
    Deno.open(path, convertFlagAndModeToOptions(flags, mode)).then(
      (file) => callback(null, file.rid),
      (err) => (callback as (err: Error) => void)(err),
    );
  }
}

export function openSync(path: string | URL): number;
export function openSync(path: string | URL, flags?: openFlags): number;
export function openSync(path: string | URL, mode?: number): number;
export function openSync(
  path: string | URL,
  flags?: openFlags,
  mode?: number,
): number;
export function openSync(
  path: string | URL,
  flagsOrMode?: openFlags | number,
  maybeMode?: number,
) {
  const flags = typeof flagsOrMode === "string" ? flagsOrMode : undefined;
  const mode = typeof flagsOrMode === "number" ? flagsOrMode : maybeMode;
  path = path instanceof URL ? fromFileUrl(path) : path;

  if (["ax", "ax+", "wx", "wx+"].includes(flags || "") && existsSync(path)) {
    throw new Error(`EEXIST: file already exists, open '${path}'`);
  }

  return Deno.openSync(path, convertFlagAndModeToOptions(flags, mode)).rid;
}
