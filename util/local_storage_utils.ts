// Copyright 2020-2021 the Deno authors. All rights reserved. MIT license.

export function getItem(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch (_e) {
    return null;
  }
}

export function setItem(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch (_e) {
    // ignore
  }
}
