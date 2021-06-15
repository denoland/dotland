// Copyright 2020-2021 the Deno authors. All rights reserved. MIT license.

export function getItem(key: string) {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    return window.localStorage.getItem(key);
  } catch (_e) {
    return null;
  }
}

export function setItem(key: string, value: string) {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.setItem(key, value);
  } catch (_e) {
    // ignore
  }
}