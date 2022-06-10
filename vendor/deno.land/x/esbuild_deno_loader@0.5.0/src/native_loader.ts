import { esbuild, fromFileUrl } from "../deps.ts";
import * as deno from "./deno.ts";

export interface LoadOptions {
  importMapURL?: URL;
}

export async function load(
  infoCache: Map<string, deno.ModuleEntry>,
  url: URL,
  options: LoadOptions,
): Promise<esbuild.OnLoadResult | null> {
  switch (url.protocol) {
    case "http:":
    case "https:":
    case "data:":
      return await loadFromCLI(infoCache, url, options);
    case "file:": {
      const res = await loadFromCLI(infoCache, url, options);
      res.watchFiles = [fromFileUrl(url.href)];
      return res;
    }
  }
  return null;
}

async function loadFromCLI(
  infoCache: Map<string, deno.ModuleEntry>,
  specifier: URL,
  options: LoadOptions,
): Promise<esbuild.OnLoadResult> {
  const specifierRaw = specifier.href;
  if (!infoCache.has(specifierRaw)) {
    const { modules, redirects } = await deno.info(specifier, {
      importMap: options.importMapURL?.href,
    });
    for (const module of modules) {
      infoCache.set(module.specifier, module);
    }
    for (const [specifier, redirect] of Object.entries(redirects)) {
      const redirected = infoCache.get(redirect);
      if (!redirected) {
        throw new TypeError("Unreachable.");
      }
      infoCache.set(specifier, redirected);
    }
  }

  const module = infoCache.get(specifierRaw);
  if (!module) {
    throw new TypeError("Unreachable.");
  }

  if (module.error) throw new Error(module.error);
  if (!module.local) throw new Error("Module not downloaded yet.");
  let loader: esbuild.Loader;
  switch (module.mediaType) {
    case "JavaScript":
    case "Mjs":
      loader = "js";
      break;
    case "JSX":
      loader = "jsx";
      break;
    case "TypeScript":
    case "Mts":
      loader = "ts";
      break;
    case "TSX":
      loader = "tsx";
      break;
    default:
      throw new Error(`Unhandled media type ${module.mediaType}.`);
  }
  const contents = await Deno.readFile(module.local);
  return { contents, loader };
}
