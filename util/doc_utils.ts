// Copyright 2022 the Deno authors. All rights reserved. MIT license.

import { DocPageNavItem } from "./registry_utils.ts";

let currentSymbols: string[] | undefined;

export function setNav(path: string, nav: DocPageNavItem[]) {
  currentSymbols = undefined;
  for (const item of nav) {
    if (item.path === path && item.kind === "module") {
      currentSymbols = item.items.flatMap(({ name }) => name ? [name] : []);
    }
  }
}

export function lookupSymbol(
  current: URL,
  _namespace: string | undefined,
  symbol: string,
): string | undefined {
  if (currentSymbols?.includes(symbol)) {
    return `${current.pathname}?s=${symbol}`;
  }
}
