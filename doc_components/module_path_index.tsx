// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
/** @jsxFrag runtime.Fragment */
import { type JsDoc } from "./deps.ts";
import { getIndex } from "./doc.ts";
import { MarkdownSummary } from "./markdown.tsx";
import { runtime, services } from "./services.ts";
import { style } from "./styles.ts";
import { type Child, take } from "./utils.ts";
import * as Icons from "./Icons.tsx";

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
      <td class={style("modulePathIndexLinkCell")}>
        <Icons.Dir class={style("modulePathIndexLinkCellIcon")} />
        <a href={href} class={style("link")}>{label}</a>
      </td>
      <td class={style("modulePathIndexDocCell")}>
        <MarkdownSummary url={url}>{summary}</MarkdownSummary>
      </td>
    </tr>
  );
}

function Module({ children, base, parent, docs }: {
  children: Child<string>;
  base: string;
  parent: string;
  docs: DocMap;
}) {
  const modulePath = take(children);
  const url = `${base}${modulePath}`;
  const href = services.resolveHref(url);
  const summary = getSummary(docs[modulePath]);
  const label = modulePath.slice(parent === "/" ? 1 : parent.length + 1);
  return (
    <tr class={style("modulePathIndexRow")}>
      <td class={style("modulePathIndexLinkCell")}>
        <Icons.SourceFile class={style("modulePathIndexLinkCellIcon")} />
        <a href={href} class={style("link")}>{label}</a>
      </td>
      <td class={style("modulePathIndexDocCell")}>
        <MarkdownSummary url={url}>{summary}</MarkdownSummary>
      </td>
    </tr>
  );
}

export function ModulePathIndex(
  { children, path = "/", base, skipMods = false, sourceUrl }: {
    children: Child<ModuleIndexWithDoc>;
    base: string;
    skipMods?: boolean;
    path?: string;
    sourceUrl: string;
  },
) {
  const { index, docs } = take(children);
  const [folders, modules] = findItems(path, index);
  const items = [];
  folders.sort();
  for (const [folder, indexModule] of folders) {
    items.push(
      <Folder base={base} docs={docs} parent={path} indexModule={indexModule}>
        {folder}
      </Folder>,
    );
  }
  if (!skipMods) {
    const moduleIndex = getIndex(modules);
    if (moduleIndex) {
      items.push(
        <Module base={base} docs={docs} parent={path}>{moduleIndex}</Module>,
      );
    }
    modules.sort();
    for (const module of modules) {
      if (module !== moduleIndex) {
        items.push(
          <Module base={base} docs={docs} parent={path}>{module}</Module>,
        );
      }
    }
  }
  if (items.length === 0) {
    return <></>;
  }
  return (
    <div class={style("modulePathIndex")}>
      <div class={style("modulePathIndexHeader")}>
        <div class={style("modulePathIndexHeaderTitle")}>
          <Icons.Index />
          <span class={style("modulePathIndexHeaderTitleSpan")}>Index</span>
        </div>
        <a
          href={services.resolveSourceHref(sourceUrl)}
          class={style("sourceButton")}
        >
          <Icons.SourceFile />
        </a>
      </div>
      <table class={style("modulePathIndexTable")}>{items}</table>
    </div>
  );
}
