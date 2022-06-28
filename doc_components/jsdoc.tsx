// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
import {
  type DocNodeModuleDoc,
  type JsDoc as JsDocNode,
  type JsDocTag as JsDocTagNode,
  type JsDocTagKind,
  tw,
} from "./deps.ts";
import { Markdown, type MarkdownContext } from "./markdown.tsx";
import { runtime } from "./services.ts";
import { style } from "./styles.ts";
import { type Child, DocNodeTupleArray, take } from "./utils.ts";

function hasDoc(tag: JsDocTagNode) {
  switch (tag.kind) {
    case "callback":
    case "deprecated":
    case "enum":
    case "example":
    case "extends":
    case "param":
    case "property":
    case "return":
    case "template":
    case "this":
    case "type":
    case "typedef":
      return !!tag.doc;
    default:
      return false;
  }
}

export function JsDoc(
  { children, tagKinds = [], tagsWithDoc = false, ...markdownContext }: {
    children: Child<JsDocNode | undefined>;
    tagKinds?: JsDocTagKind[] | JsDocTagKind;
    tagsWithDoc?: boolean;
  } & MarkdownContext,
) {
  const jsDoc = take(children);
  if (!jsDoc) {
    return null;
  }
  const docTags = [];
  for (const tag of jsDoc.tags ?? []) {
    if (
      (tagKinds.includes(tag.kind) || tag.kind === "example") &&
      !(tagsWithDoc && !hasDoc(tag))
    ) {
      docTags.push(<JsDocTag {...markdownContext}>{tag}</JsDocTag>);
    }
  }
  return (
    <div>
      <Markdown {...markdownContext}>{jsDoc.doc}</Markdown>
    </div>
  );
}

export function JsDocTag(
  { children, ...markdownContext }:
    & { children: Child<JsDocTagNode> }
    & MarkdownContext,
) {
  const tag = take(children);
  switch (tag.kind) {
    case "callback":
    case "param":
    case "property":
    case "template":
    case "typedef":
      return (
        <div>
          <div>
            <span class={style("tagKind")}>@{tag.kind}</span>{" "}
            <span class={style("tagName")}>{tag.name}</span>
          </div>
          <Markdown {...markdownContext}>{tag.doc}</Markdown>
        </div>
      );
    case "constructor":
    case "module":
    case "private":
    case "protected":
    case "public":
    case "readonly":
      return (
        <div>
          <span class={style("tagKind")}>@{tag.kind}</span>
        </div>
      );
    case "deprecated":
    case "enum":
    case "return":
      return (
        <div>
          <div>
            <span class={style("tagKind")}>@{tag.kind}</span>
          </div>
          <Markdown {...markdownContext}>{tag.doc}</Markdown>
        </div>
      );
    case "example": {
      const doc = tag.doc && !tag.doc.includes("```")
        ? `\`\`\`ts\n${tag.doc}${tag.doc.endsWith("\n") ? "" : "\n"}\`\`\``
        : tag.doc;
      return (
        <div>
          <div>
            <span class={style("tagKind")}>@{tag.kind}</span>
          </div>
          <Markdown {...markdownContext}>{doc}</Markdown>
        </div>
      );
    }
    case "extends":
    case "this":
    case "type":
      return (
        <div>
          <div>
            <span class={style("tagKind")}>@{tag.kind}</span>{" "}
            <span class={style("tagName")}>{tag.type}</span>
          </div>
          <Markdown {...markdownContext}>{tag.doc}</Markdown>
        </div>
      );
  }
  return null;
}

export function JsDocModule(
  { children, ...markdownContext }: {
    children: Child<DocNodeTupleArray<DocNodeModuleDoc>>;
  } & MarkdownContext,
) {
  const moduleDoc = take(children, true, true);
  const [[, { jsDoc }]] = moduleDoc;
  return <JsDoc {...markdownContext}>{jsDoc}</JsDoc>;
}

export function Tag(
  { children, color = "gray" }: { children: unknown; color: string },
) {
  return (
    <span>
      {" "}
      <span
        class={tw`bg-${color}(100 dark:800) text-${color}(800 dark:100) ${
          style("tag", true)
        }`}
      >
        {children}
      </span>
    </span>
  );
}
