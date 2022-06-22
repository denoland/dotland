// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
/** @jsxFrag runtime.Fragment */
import { type DocNode, type JsDoc, tw } from "./deps.ts";
import { getIndex } from "./doc.ts";
import { MarkdownSummary } from "./markdown.tsx";
import { runtime, services } from "./services.ts";
import { style } from "./styles.ts";
import { type Child, maybe, take } from "./utils.ts";

interface FolderItem {
  name: string;
  folders: FolderItem[];
  modules: string[];
}

type DocMap = Record<string, JsDoc>;

export interface ModuleIndexWithDoc {
  index: Record<string, string[]>;
  docs: DocMap;
}

function getSummary(jsDoc: JsDoc | undefined): string | undefined {
  if (jsDoc?.doc) {
    const [summary] = jsDoc.doc.split("\n\n");
    return summary;
  }
}

/** Convert an index of modules into a tree of modules. */
function toTree(path: string, index: Record<string, string[]>): FolderItem {
  const folderItems = Object.keys(index)
    .filter((k) => k.startsWith(path))
    .map<[string, FolderItem]>((name) => [
      name,
      {
        name,
        folders: [],
        modules: index[name],
      },
    ]);
  const folderMap = Object.fromEntries(folderItems);
  for (const [name, folderItem] of folderItems) {
    if (name !== path) {
      const parts = name.split("/");
      parts.pop();
      const parentName = parts.length > 1 ? parts.join("/") : "/";
      const parent = folderMap[parentName];
      if (parent) {
        parent.folders.push(folderItem);
      }
    }
  }
  return folderMap[path];
}

function Folder(
  { children, base, parent, docs }: {
    children: Child<FolderItem>;
    base: string;
    parent: string;
    docs: DocMap;
  },
) {
  const folderItem = take(children);
  const { name, modules } = folderItem;
  const url = `${base}${name}`;
  const href = services.resolveHref(url);
  const id = name.slice(1).replaceAll(/[\s/]/g, "_") || "_root";
  const indexModule = getIndex(modules);
  const summary = getSummary(indexModule ? docs[indexModule] : undefined);
  const label = parent === "/"
    ? name.slice(parent.length)
    : name.slice(parent.length + 1);
  return (
    <tr class={style("moduleIndexRow")}>
      <td colSpan={2} class={style("moduleIndexPanelCell")} id={`group_${id}`}>
        <input
          type="checkbox"
          id={`id_${id}`}
          checked
          class={tw`hidden`}
          aria-controls={`group_${id}`}
        />
        <label for={`id_${id}`} class={style("panelTitle")}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 0 24 24"
            width="24"
            fill="#currentColor"
            class={style("rightArrow")}
          >
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path d="M10 17l5-5-5-5v10z" />
          </svg>
          <span class={tw`mr-4`}>
            <a href={href} class={style("link")}>{label}</a>
          </span>
          <MarkdownSummary url={url}>{summary}</MarkdownSummary>
        </label>
        <div class={`content ${tw`ml-4`}`}>
          <FolderContent base={base} docs={docs}>{folderItem}</FolderContent>
        </div>
      </td>
    </tr>
  );
}

function Module(
  { children, base, parent, docs }: {
    children: Child<string>;
    base: string;
    parent: string;
    docs: DocMap;
  },
) {
  const modulePath = take(children);
  const url = `${base}${modulePath}`;
  const href = services.resolveHref(url);
  const summary = getSummary(docs[modulePath]);
  const label = parent === "/"
    ? modulePath.slice(parent.length)
    : modulePath.slice(parent.length + 1);
  return (
    <tr class={style("moduleIndexRow")}>
      <td class={style("moduleIndexModuleCell")}>
        <a href={href} class={style("link")}>{label}</a>
      </td>
      <td class={style("moduleIndexCell")}>
        <MarkdownSummary url={url}>{summary}</MarkdownSummary>
      </td>
    </tr>
  );
}

function FolderContent(
  { children, base, docs }: {
    children: Child<FolderItem>;
    base: string;
    docs: DocMap;
  },
) {
  const { folders, modules, name } = take(children);
  const items = [];
  for (const folderItem of folders) {
    if (folderItem.folders.length || folderItem.modules.length) {
      items.push(
        <Folder base={base} docs={docs} parent={name}>{folderItem}</Folder>,
      );
    }
  }
  const indexModule = getIndex(modules);
  if (indexModule) {
    items.push(
      <Module base={base} docs={docs} parent={name}>{indexModule}</Module>,
    );
  }
  modules.sort();
  for (const mod of modules) {
    if (mod !== indexModule) {
      items.push(<Module base={base} docs={docs} parent={name}>{mod}</Module>);
    }
  }
  return (
    <table class={style("moduleIndexTable")}>
      <tbody class={style("moduleIndexTableBody")}>{items}</tbody>
    </table>
  );
}

export function ModuleIndex({ children, path = "/", base }: {
  children: Child<ModuleIndexWithDoc>;
  path?: string;
  base: string;
}) {
  const { index, docs } = take(children);
  const root = toTree(path, index);
  return (
    <div>
      <FolderContent base={base} docs={docs}>{root}</FolderContent>
    </div>
  );
}
