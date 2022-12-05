// Copyright 2022 the Deno authors. All rights reserved. MIT license.

import { type SymbolIndexItem } from "./registry_utils.ts";

interface GlobalSymbolItem {
  name: string;
  library: "esnext" | "deno";
  unstable?: boolean;
}

const GLOBAL_SYMBOLS_ENDPOINT = "https://apiland.deno.dev/v2/symbols/global";
const GLOBAL_SYMBOLS_INIT = { headers: { "accept": "application/json" } };

const currentSymbols = new Set<string>();
const currentImports = new Map<string, string>();
const globalSymbols = new Map<string, "esnext" | "deno" | "deno-unstable">();

/** Called to set/clear the current symbol information, so when symbol lookups
 * occur, they have the correct information to resolve the link. */
export async function setSymbols(symbols?: SymbolIndexItem[]): Promise<void> {
  if (!globalSymbols.size) {
    try {
      const res = await fetch(GLOBAL_SYMBOLS_ENDPOINT, GLOBAL_SYMBOLS_INIT);
      if (res.status === 200) {
        const globalSymbolItems: GlobalSymbolItem[] = await res.json();
        for (const { name, library, unstable } of globalSymbolItems) {
          globalSymbols.set(
            name,
            library === "esnext"
              ? "esnext"
              : unstable
              ? "deno-unstable"
              : "deno",
          );
        }
      } else {
        throw new Error(
          `Unexpected fetch response: ${res.status} ${res.statusText}`,
        );
      }
    } catch (e) {
      console.error(e);
      globalSymbols.set("__failed__", "deno");
    }
  }
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

function globalSymbolHref(current: URL, symbol: string) {
  const lib = globalSymbols.get(symbol)!;
  if (lib !== "esnext") {
    const target = new URL(current);
    target.pathname = "/api";
    target.search = "";
    target.searchParams.set("s", symbol);
    target.searchParams.delete("p");
    if (lib === "deno-unstable") {
      target.searchParams.set("unstable", "");
    }
    return target.href;
  }
}

/** Provided the current URL, current namespace, and symbol, attempt to resolve
 * a link to the symbol. */
export function lookupSymbol(
  current: URL,
  namespace: string | undefined,
  symbol: string,
): string | undefined {
  if (namespace) {
    const parts = namespace.split(".");
    while (parts.length) {
      const name = [...parts, symbol].join(".");
      if (currentSymbols.size) {
        if (currentSymbols.has(name)) {
          const target = new URL(current);
          target.searchParams.set("s", name);
          target.searchParams.delete("p");
          return target.href;
        }
      } else {
        if (globalSymbols.has(name)) {
          return globalSymbolHref(current, name);
        }
      }
      parts.pop();
    }
  }
  if (currentSymbols.has(symbol)) {
    const target = new URL(current);
    target.searchParams.set("s", symbol);
    target.searchParams.delete("p");
    return target.href;
  }
  if (currentImports.has(symbol)) {
    const src = currentImports.get(symbol)!;
    const srcURL = new URL(src);
    if (src.startsWith("https://deno.land/")) {
      srcURL.searchParams.set("s", symbol);
      return srcURL.href;
    } else {
      // other sources, we will attempt to send them to docland for
      // documentation
      srcURL.pathname += `/~/${symbol}`;
      return `https://doc.deno.land/${srcURL.toString()}`;
    }
  }
  if (globalSymbols.has(symbol)) {
    return globalSymbolHref(current, symbol);
  }
}
