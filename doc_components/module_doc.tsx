// Copyright 2021-2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
import { type DocNode, tw } from "./deps.ts";
import { getDocSummary } from "./doc.ts";
import { JsDocModule, Tag } from "./jsdoc.tsx";
import { type MarkdownContext, MarkdownSummary } from "./markdown.tsx";
import { runtime, services } from "./services.ts";
import { style, type StyleKey } from "./styles.ts";
import { Usage } from "./usage.tsx";
import {
  asCollection,
  byName,
  type Child,
  DocNodeTupleArray,
  isAbstract,
  isDeprecated,
  maybe,
  take,
} from "./utils.ts";

export const TARGET_RE = /(\s|[\[\]])/g;

function Anchor({ children: name }: { children: Child<string> }) {
  return (
    <a
      href={`#${name}`}
      class={style("anchor")}
      aria-label="Anchor"
      tabIndex={-1}
    >
    </a>
  );
}

function Entry<Node extends DocNode>(
  { children, style: entryStyle, ...context }: {
    children: Child<[label: string, node: Node]>;
    style: StyleKey;
  } & MarkdownContext,
) {
  const [label, node] = take(children, true);
  return (
    <tr class={style("symbolListRow")}>
      <td class={style("symbolListCell")}>
        <span class={style(entryStyle)}>
          <DocLink {...context}>{label}</DocLink>
          {maybe(isAbstract(node), <Tag color="yellow">abstract</Tag>)}
          {maybe(isDeprecated(node), <Tag color="gray">👎 deprecated</Tag>)}
        </span>
      </td>
      <td class={tw`block lg:table-cell ${style("symbolListCell")}`}>
        <MarkdownSummary {...context}>
          {getDocSummary(node)}
        </MarkdownSummary>
      </td>
    </tr>
  );
}

export function DocLink(
  { children, url, namespace }: {
    children: Child<string>;
    url: string;
    namespace?: string;
  },
) {
  const label = take(children);
  const href = services.resolveHref(
    url,
    namespace ? `${namespace}.${label}` : label,
  );
  return <a href={href}>{label}</a>;
}

function Section<Node extends DocNode>(
  { children, title, style: entryStyle, ...markdownContext }: {
    children: Child<DocNodeTupleArray<Node>>;
    title: string;
    style: StyleKey;
  } & MarkdownContext,
) {
  const tuples = take(children, true, true);
  const displayed = new Set();
  const items = tuples.sort(byName).map(([label, node]) => {
    if (displayed.has(label)) {
      return null;
    }
    displayed.add(label);
    return (
      <Entry style={entryStyle} {...markdownContext}>{[label, node]}</Entry>
    );
  });
  return (
    <div>
      <SectionTitle>{title}</SectionTitle>
      <table class={style("symbolListTable")}>{items}</table>
    </div>
  );
}

function SectionTitle({ children }: { children: Child<string> }) {
  const name = take(children);
  const id = name.replaceAll(TARGET_RE, "_");
  return (
    <h2 class={style("section")} id={id}>
      <Anchor>{id}</Anchor>
      {name}
    </h2>
  );
}

export function ModuleDoc(
  { children, library = false, ...markdownContext }: {
    children: Child<DocNode[]>;
    library?: boolean;
  } & MarkdownContext,
) {
  const { url } = markdownContext;
  const collection = asCollection(take(children, true));
  return (
    <article class={style("main")}>
      {maybe(
        !(library || url.endsWith(".d.ts")),
        <div>
          <h1 class={style("section")}>Usage</h1>
          <Usage url={url} />
          {collection.moduleDoc && (
            <JsDocModule url={url}>{collection.moduleDoc}</JsDocModule>
          )}
          {collection.namespace && (
            <Section
              title="Namespaces"
              style="entryNamespace"
              {...markdownContext}
            >
              {collection.namespace}
            </Section>
          )}
          {collection.class && (
            <Section title="Classes" style="entryClass" {...markdownContext}>
              {collection.class}
            </Section>
          )}
          {collection.enum && (
            <Section title="Enums" style="entryEnum" {...markdownContext}>
              {collection.enum}
            </Section>
          )}
          {collection.variable && (
            <Section
              title="Variables"
              style="entryVariable"
              {...markdownContext}
            >
              {collection.variable}
            </Section>
          )}
          {collection.function && (
            <Section
              title="Functions"
              style="entryFunction"
              {...markdownContext}
            >
              {collection.function}
            </Section>
          )}
          {collection.interface && (
            <Section
              title="Interfaces"
              style="entryInterface"
              {...markdownContext}
            >
              {collection.interface}
            </Section>
          )}
          {collection.typeAlias && (
            <Section
              title="Type Aliases"
              style="entryTypeAlias"
              {...markdownContext}
            >
              {collection.typeAlias}
            </Section>
          )}
        </div>,
      )}
    </article>
  );
}
