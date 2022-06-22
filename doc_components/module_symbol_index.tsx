// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
/** @jsxFrag runtime.Fragment */
import { type DocNode, type DocNodeKind, type JsDoc, tw } from "./deps.ts";
import { byKindValue, getIndex } from "./doc.ts";
import { MarkdownSummary } from "./markdown.tsx";
import { runtime, services } from "./services.ts";
import { style, type StyleKey } from "./styles.ts";
import { type Child, take } from "./utils.ts";

type DocMap = Record<string, JsDoc>;

export interface ModuleIndexWithDoc {
  index: Record<string, string[]>;
  docs: DocMap;
}

function findItems(
  path: string,
  index: Record<string, string[]>,
): [folders: [string, string | undefined][], modules: string[]] {
  let modules: string[] = [];
  const folders: [string, string | undefined][] = [];
  for (const [key, value] of Object.entries(index)) {
    if (key === path) {
      modules = value;
    } else if (
      key.startsWith(path) &&
      !key.slice(path === "/" ? path.length : path.length + 1).includes("/") &&
      value.length
    ) {
      folders.push([key, getIndex(value)]);
    }
  }
  return [folders, modules];
}

function getSummary(jsDoc: JsDoc | undefined): string | undefined {
  if (jsDoc?.doc) {
    const [summary] = jsDoc.doc.split("\n\n");
    return summary;
  }
}

function Folder({ children, base, parent, indexModule, docs }: {
  children: Child<string>;
  base: string;
  parent: string;
  indexModule: string | undefined;
  docs: DocMap;
}) {
  const folderName = take(children);
  const url = `${base}${folderName}`;
  const href = services.resolveHref(url);
  const summary = getSummary(indexModule ? docs[indexModule] : undefined);
  const label = `${folderName.slice(parent === "/" ? 1 : parent.length + 1)}/`;
  return (
    <tr class={style("modulePathIndexRow")}>
      <td class={style("modulePathIndexCell")}>
        <a href={href} class={style("link")}>{label}</a>
      </td>
      <td class={style("modulePathIndexCell")}>
        <MarkdownSummary url={url}>{summary}</MarkdownSummary>
      </td>
    </tr>
  );
}

interface SymbolRecord {
  mod: string;
  name: string;
  kind: DocNodeKind;
  href: string;
  summary?: string;
}

function symbolRecord(
  { mod: modA, name: nameA, kind: kindA }: SymbolRecord,
  { mod: modB, name: nameB, kind: kindB }: SymbolRecord,
): number {
  if (modA !== modB) {
    return modA.localeCompare(modB);
  }
  if (nameA !== nameB) {
    return nameA.localeCompare(nameB);
  }
  return byKindValue(kindA, kindB);
}

const PRINT_KINDS: DocNodeKind[] = [
  "namespace",
  "class",
  "interface",
  "typeAlias",
  "variable",
  "function",
  "enum",
];

function getStyleByKind(kind: DocNodeKind): StyleKey {
  switch (kind) {
    case "class":
      return "symbolClass";
    case "enum":
      return "symbolEnum";
    case "function":
      return "symbolFunction";
    case "interface":
      return "symbolInterface";
    case "namespace":
      return "symbolNamespace";
    case "typeAlias":
      return "symbolTypeAlias";
    case "variable":
      return "symbolVariable";
    default:
      return "none";
  }
}

function collectSymbols(
  base: string,
  path: string,
  modules: string[],
  entries: Record<string, DocNode[]>,
): SymbolRecord[] {
  const symbols: SymbolRecord[] = [];
  for (const module of modules) {
    const docNodes = entries[module];
    if (!docNodes) {
      continue;
    }
    let mod = module.slice(path === "/" ? 1 : path.length + 1);
    const lastIndex = mod.lastIndexOf(".");
    if (lastIndex > 0) {
      mod = mod.slice(0, lastIndex);
    }
    const url = `${base}${module}`;
    const records = new Map<string, SymbolRecord>();
    for (const { name, kind, jsDoc } of docNodes) {
      if (PRINT_KINDS.includes(kind)) {
        const href = services.resolveHref(url, name);
        const summary = getSummary(jsDoc);
        if (!records.has(name)) {
          const record = { mod, name, kind, href, summary };
          records.set(name, record);
          symbols.push(record);
        } else if (summary) {
          const record = records.get(name)!;
          if (!record.summary) {
            record.summary = summary;
          }
        }
      }
    }
  }
  symbols.sort(symbolRecord);
  return symbols;
}

function Sym(
  { children, href, kind, url, summary }: {
    children: Child<string>;
    kind: DocNodeKind;
    href: string;
    url: string;
    summary?: string;
  },
) {
  const name = take(children);
  return (
    <tr class={style("modulePathIndexRow")}>
      <td class={style("modulePathIndexSymbolCell")}>
        <a href={href} class={style(getStyleByKind(kind))}>{name}</a>
      </td>
      <td class={style("modulePathIndexCell")}>
        <MarkdownSummary url={url}>{summary}</MarkdownSummary>
      </td>
    </tr>
  );
}

export function ModuleSymbolIndex(
  { children, base, path = "/", entries }: {
    children: Child<ModuleIndexWithDoc>;
    base: string;
    path?: string;
    entries: Record<string, DocNode[]>;
  },
) {
  const { index, docs } = take(children);
  const [folders, modules] = findItems(path, index);
  const items = [];
  for (const [folder, indexModule] of folders) {
    items.push(
      <Folder base={base} docs={docs} parent={path} indexModule={indexModule}>
        {folder}
      </Folder>,
    );
  }
  const symbols = collectSymbols(base, path, modules, entries);
  let currMod = "";
  const url = `${base}${path}`;
  for (const { mod, name, kind, href, summary } of symbols) {
    if (currMod !== mod) {
      items.push(
        <tr class={style("modulePathIndexRow")}>
          <td colSpan={2} class={style("modulePathIndexCell")}>{mod}</td>
        </tr>,
      );
      currMod = mod;
    }
    items.push(
      <Sym kind={kind} href={href} summary={summary} url={url}>{name}</Sym>,
    );
  }
  return <table class={style("modulePathIndexTable")}>{items}</table>;
}
