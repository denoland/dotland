// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

import {
  comrak,
  type Configuration as TwConfiguration,
  setup as twSetup,
  type ThemeConfiguration,
  twColors,
} from "./deps.ts";

interface JsxRuntime {
  Fragment: (props: Record<string, unknown>) => unknown;
  h: (
    type: string,
    props: Record<string, unknown>,
    // deno-lint-ignore no-explicit-any
    ...children: any[]
  ) => unknown;
}

export interface Configuration {
  /** Called when the doc components are trying to resolve a symbol.  The
   * current url is provided as a string, an optional namespace and the symbol
   * name attempting to be resolved.
   *
   * If provided the namespace, any nested namespaces will be separated by a
   * `.`.
   *
   * Implementors should search the scope of the current module and namespace
   * ascending to global scopes to resolve the href. If the symbol cannot be
   * found, the function should return `undefined`. */
  lookupHref?: (
    url: string,
    namespace: string | undefined,
    symbol: string,
  ) => string | undefined;
  /** Called when the doc components are trying to generate a link to a path,
   * module or symbol within a module.  The URL to the path or module will be
   * provided, and the symbol will be provided.  If the symbol contains `.`,
   * the symbol is located within a namespace in the file.
   *
   * Implementors should return a string which will be used as the `href` value
   * for a link. */
  resolveHref?: (url: string, symbol?: string) => string;
  /** The JSX runtime that should be used. */
  runtime?: JsxRuntime;
  /** If provided, the twind {@linkcode twSetup setup} will be performed. */
  tw?: TwConfiguration;
}

export const theme: ThemeConfiguration = {
  backgroundSize: {
    "4": "1rem",
  },
  colors: {
    transparent: "transparent",
    current: "currentColor",
    black: twColors.black,
    white: twColors.white,
    gray: twColors.coolGray,
    red: twColors.red,
    yellow: twColors.amber,
    green: twColors.emerald,
    cyan: twColors.cyan,
    blue: twColors.lightBlue,
    indigo: twColors.indigo,
    purple: twColors.fuchsia,
    pink: twColors.pink,
  },
  fontFamily: {
    "sans": [
      "Inter var",
      "system-ui",
      "Segoe UI",
      "Roboto",
      "Helvetica Neue",
      "Arial",
      "Noto Sans",
      "sans-serif",
    ],
    "mono": [
      "Menlo",
      "Monaco",
      "Lucida Console",
      "Consolas",
      "Liberation Mono",
      "Courier New",
      "monospace",
    ],
  },
};

const runtimeConfig: Required<
  Pick<Configuration, "resolveHref" | "lookupHref" | "runtime">
> = {
  resolveHref(current, symbol) {
    return symbol ? `/${current}` : `/${current}/~/${symbol}`;
  },
  lookupHref(current, namespace, symbol) {
    return namespace
      ? `/${current}/~/${namespace}.${symbol}`
      : `/${current}/~/${symbol}`;
  },
  runtime: {
    Fragment() {
      throw new TypeError(
        "The JSX runtime.Fragment is unset and must be set via setup().",
      );
    },
    h() {
      throw new TypeError(
        "The JSX runtime.h is unset and must be set via setup().",
      );
    },
  },
};

/** Setup the services used by the doc components. */
export async function setup(config: Configuration) {
  const { runtime, tw, ...other } = config;
  Object.assign(runtimeConfig, other);
  if (runtime) {
    Object.assign(runtimeConfig.runtime, runtime);
  }
  if (tw) {
    twSetup(tw);
  }
  await comrak.init();
}

export const runtime: JsxRuntime = {
  get Fragment() {
    return runtimeConfig.runtime.Fragment;
  },
  get h() {
    return runtimeConfig.runtime.h;
  },
};

export const services = {
  /** Return a link to the provided URL and optional symbol. */
  get resolveHref(): (url: string, symbol?: string) => string {
    return runtimeConfig.resolveHref;
  },

  /** Attempt to find a link to a specific symbol from the current URL and
   * optionally namespace. */
  get lookupHref(): (
    url: string,
    namespace: string | undefined,
    symbol: string,
  ) => string | undefined {
    return runtimeConfig.lookupHref;
  },
};
