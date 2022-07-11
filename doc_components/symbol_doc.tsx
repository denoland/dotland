// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
import { CodeBlockClass, DocBlockClass } from "./classes.tsx";
import {
  type DocNode,
  type DocNodeFunction,
  type DocNodeInterface,
  type DocNodeTypeAlias,
} from "./deps.ts";
import { byKind, isAbstract, isDeprecated } from "./doc.ts";
import { CodeBlockEnum } from "./enums.tsx";
import { CodeBlockFn } from "./functions.tsx";
import { CodeBlockInterface } from "./interfaces.tsx";
import { JsDoc, Tag } from "./jsdoc.tsx";
import { type MarkdownContext } from "./markdown.tsx";
import { runtime, services } from "./services.ts";
import { style } from "./styles.ts";
import { CodeBlockTypeAlias } from "./type_aliases.tsx";
import { Usage } from "./usage.tsx";
import { type Child, maybe, take } from "./utils.ts";
import { CodeBlockVariable } from "./variables.tsx";
import * as Icons from "./Icons.tsx";

function CodeBlock(
  { children, ...markdownContext }:
    & { children: Child<DocNode[]> }
    & MarkdownContext,
) {
  const docNodes = take(children, true);
  const elements = [];
  for (const docNode of docNodes) {
    switch (docNode.kind) {
      case "class":
        elements.push(
          <CodeBlockClass {...markdownContext}>{docNode}</CodeBlockClass>,
        );
        break;
      case "enum":
        elements.push(
          <CodeBlockEnum {...markdownContext}>{docNode}</CodeBlockEnum>,
        );
        break;
      case "interface":
        elements.push(
          <CodeBlockInterface {...markdownContext}>
            {docNode}
          </CodeBlockInterface>,
        );
        break;
      case "typeAlias":
        elements.push(
          <CodeBlockTypeAlias {...markdownContext}>
            {docNode}
          </CodeBlockTypeAlias>,
        );
        break;
      case "variable":
        elements.push(
          <CodeBlockVariable {...markdownContext}>{docNode}</CodeBlockVariable>,
        );
        break;
    }
  }
  const fnNodes = docNodes.filter(({ kind }) =>
    kind === "function"
  ) as DocNodeFunction[];
  if (fnNodes.length) {
    elements.push(<CodeBlockFn {...markdownContext}>{fnNodes}</CodeBlockFn>);
  }
  return <div>{elements}</div>;
}

function DocBlock(
  { children, ...markdownContext }:
    & { children: Child<DocNode[]> }
    & MarkdownContext,
) {
  const docNodes = take(children, true);
  const elements = [];
  for (const docNode of docNodes) {
    switch (docNode.kind) {
      case "class":
        elements.push(
          <DocBlockClass {...markdownContext}>{docNode}</DocBlockClass>,
        );
        break;
    }
  }
  const fnNodes = docNodes.filter(({ kind }) =>
    kind === "function"
  ) as DocNodeFunction[];
  if (fnNodes.length) {
    // elements.push(<DocBlockFn {...markdownContext}>{fnNodes}</DocBlockFn>);
  }
  return <div>{elements}</div>;
}

function isTypeOnly(
  docNodes: DocNode[],
): docNodes is (DocNodeInterface | DocNodeTypeAlias)[] {
  return docNodes.every(({ kind }) =>
    kind === "interface" || kind === "typeAlias"
  );
}

export function SymbolDoc(
  { children, library = false, url, namespace }: {
    children: Child<DocNode[]>;
    library?: boolean;
    url: string;
    namespace?: string;
  },
) {
  const docNodes = [...take(children, true)];
  docNodes.sort(byKind);
  const jsDoc = docNodes.map(({ jsDoc }) => jsDoc).find((jsDoc) => !!jsDoc);
  const [{ name, location }] = docNodes;
  const title = namespace ? `${namespace}.${name}` : name;
  const markdownContext = { url, namespace };
  return (
    <article class={style("main")}>
      <div class={style("symbolDocHeader")}>
        <h1 class={style("title")}>{title}</h1>
        <a
          href={services.resolveSourceHref(location.filename, location.line)}
          class={style("sourceButton")}
        >
          <Icons.SourceFile />
        </a>
      </div>
      {maybe(
        !(url.endsWith(".d.ts") || library),
        <Usage url={url} name={title} isType={isTypeOnly(docNodes)} />,
      )}
      {maybe(isAbstract(docNodes[0]), <Tag color="yellow">abstract</Tag>)}
      {maybe(isDeprecated(docNodes[0]), <Tag color="gray">deprecated</Tag>)}
      <JsDoc tagKinds="deprecated" tagsWithDoc {...markdownContext}>
        {jsDoc}
      </JsDoc>
      <CodeBlock {...markdownContext}>{docNodes}</CodeBlock>
      <DocBlock {...markdownContext}>{docNodes}</DocBlock>
    </article>
  );
}
