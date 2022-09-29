// Copyright 2022 the Deno authors. All rights reserved. MIT license.

import { type SymbolIndexItem } from "./registry_utils.ts";

const currentSymbols = new Set<string>();
const currentImports = new Map<string, string>();

/** Called to set/clear the current symbol information, so when symbol lookups
 * occur, they have the correct information to resolve the link. */
export function setSymbols(symbols?: SymbolIndexItem[]) {
  currentSymbols.clear();
  currentImports.clear();
  if (symbols) {
    for (const { name, declarationKind, kind, filename } of symbols) {
      if (declarationKind === "export") {
        currentSymbols.add(name);
      } else if (kind === "import") {
        currentImports.set(name, filename);
      }
    }
  }
}

/** Provided the current URL, current namespace, and symbol, attempt to resolve
 * a link to the symbol. */
export function lookupSymbol(
  current: URL,
  namespace: string | undefined,
  symbol: string,
): string | undefined {
  if (!currentSymbols.size) {
    return undefined;
  }
  if (namespace) {
    const parts = namespace.split(".");
    while (parts.length) {
      const name = [...parts, symbol].join(".");
      if (currentSymbols.has(name)) {
        return `${current.pathname}?s=${name}`;
      }
      parts.pop();
    }
  }
  if (currentSymbols.has(symbol)) {
    return `${current.pathname}?s=${symbol}`;
  }
  if (currentImports.has(symbol)) {
    const src = currentImports.get(symbol)!;
    if (src.startsWith("https://deno.land/")) {
      const srcURL = new URL(src);
      return `${srcURL.pathname}?s=${symbol}`;
    }
  }
}
