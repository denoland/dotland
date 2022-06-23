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

function Entry<Node extends DocNode>(
  { children, ...context }: {
    children: Child<[label: string, node: Node]>;
  } & MarkdownContext,
) {
  const [label, node] = take(children, true);
  return (
    <tr class={style("symbolListRow")}>
      <td class={style("symbolListCellSymbol")}>
        <span>
          <DocLink {...context}>{label}</DocLink>
          {maybe(isAbstract(node), <Tag color="yellow">abstract</Tag>)}
          {maybe(isDeprecated(node), <Tag color="gray">👎 deprecated</Tag>)}
        </span>
      </td>
      <td class={style("symbolListCellDoc")}>
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

const colors = {
  "Namespaces": "#D25646",
  "Classes": "#2FA850",
  "Enums": "#22abb0",
  "Variables": "#7E57C0",
  "Functions": "#026BEB",
  "Interfaces": "#D4A068",
  "Type Aliases": "#A4478C",
} as const;
type sectionTitle = keyof typeof colors;

function Section<Node extends DocNode>(
  { children, title, ...markdownContext }: {
    children: Child<DocNodeTupleArray<Node>>;
    title: sectionTitle;
  } & MarkdownContext,
) {
  const tuples = take(children, true, true);
  const displayed = new Set();
  const items = tuples.sort(byName).map(([label, node]) => {
    if (displayed.has(label)) {
      return null;
    }
    displayed.add(label);
    return <Entry {...markdownContext}>{[label, node]}</Entry>;
  });
  return (
    <div>
      <SectionTitle>{title}</SectionTitle>
      <table class={style("symbolListTable")}>{items}</table>
    </div>
  );
}

function SectionTitle({ children }: { children: Child<sectionTitle> }) {
  const name = take(children);
  const id = name.replaceAll(TARGET_RE, "_");
  return (
    <h2 class={tw`text-[${colors[name]}] ${style("section")}`} id={id}>
      <a href={`#${name}`} aria-label="Anchor">
        {name}
      </a>
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
        <div class={style("moduleDoc")}>
          <div class={tw`space-y-3`}>
            <Usage url={url} />
            {collection.moduleDoc && (
              <JsDocModule url={url} markdownStyle="usage">{collection.moduleDoc}</JsDocModule>
            )}
          </div>
          {collection.namespace && (
            <Section title="Namespaces" {...markdownContext}>
              {collection.namespace}
            </Section>
          )}
          {collection.class && (
            <Section title="Classes" {...markdownContext}>
              {collection.class}
            </Section>
          )}
          {collection.enum && (
            <Section title="Enums" {...markdownContext}>
              {collection.enum}
            </Section>
          )}
          {collection.variable && (
            <Section title="Variables" {...markdownContext}>
              {collection.variable}
            </Section>
          )}
          {collection.function && (
            <Section title="Functions" {...markdownContext}>
              {collection.function}
            </Section>
          )}
          {collection.interface && (
            <Section title="Interfaces" {...markdownContext}>
              {collection.interface}
            </Section>
          )}
          {collection.typeAlias && (
            <Section title="Type Aliases" {...markdownContext}>
              {collection.typeAlias}
            </Section>
          )}
        </div>,
      )}
    </article>
  );
}
