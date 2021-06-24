/* Copyright 2021 the Deno authors. All rights reserved. MIT license. */

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import dompurify from "dompurify";

import unified from "unified";
import parse from "reorg-parse";

import {
  markup,
  MarkupProps,
  scrollEffect,
  slugify,
  transformLinkUri,
} from "./Markup";
import { RawCodeBlock } from "./CodeBlock";

import {
  Block,
  Document,
  Drawer,
  Footnote,
  HTML,
  Headline,
  HorizontalRule,
  Keyword,
  List,
  ListItem,
  Paragraph,
  PhrasingContent,
  Planning,
  Section,
  StyledText,
  Table,
  Token,
} from "orga/dist/types";

function parseSource(source: string): Document {
  return unified().use(parse).parse(source) as Document;
}

type TopLevelContent = Content | Keyword | Footnote;
type Content =
  | Section
  | Paragraph
  | Block
  | Drawer
  | Planning
  | List
  | Table
  | HorizontalRule
  | Headline
  | HTML;

function orgToHTML(props: MarkupProps, node: Document): string {
  function nonHTML(text: string) {
    return text
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }

  function wrapped(tag: string, text: string) {
    return `<${tag}>${nonHTML(text)}</${tag}>`;
  }

  function isStyledText(node: { type: string }): node is StyledText {
    return [
      "text.plain",
      "text.bold",
      "text.code",
      "text.verbatim",
      "text.italic",
      "text.strikeThrough",
      "text.underline",
    ].includes(node.type);
  }

  function isPhrasingContent(node: { type: string }): node is PhrasingContent {
    return (
      ["link", "footnote.reference", "newline"].includes(node.type) ||
      isStyledText(node)
    );
  }

  function isToken(node: { type: string }): node is Token {
    return (
      [
        "keyword",
        "todo",
        "hr",
        "stars",
        "priority",
        "tags",
        "planning.keyword",
        "planning.timestamp",
        "list.item.tag",
        "list.item.checkbox",
        "list.item.bullet",
        "table.hr",
        "table.columnSeparator",
        "footnote.label",
        "block.begin",
        "block.end",
        "drawer.begin",
        "drawer.end",
      ].includes(node.type) || isPhrasingContent(node)
    );
  }

  function styledTextToHTML(node: StyledText): string {
    switch (node.type) {
      case "text.plain":
        return nonHTML(node.value);
      case "text.bold":
        return wrapped("strong", node.value);
      case "text.code":
      case "text.verbatim":
        return wrapped("code", node.value);
      case "text.italic":
        return wrapped("em", node.value);
      case "text.strikeThrough":
        return wrapped("del", node.value);
      case "text.underline":
        return `<span style="text-decoration: underline;">${nonHTML(
          node.value
        )}</span>`;
    }
  }

  function tokenToHTML(node: Token): string {
    if (isPhrasingContent(node)) {
      return phrasingContentToHTML(node);
    }
    return `TODO: token: ${node.type}`;
  }

  function phrasingContentToHTML(node: PhrasingContent): string {
    if (isStyledText(node)) {
      return styledTextToHTML(node);
    }
    switch (node.type) {
      case "link": {
        // for links like [[https://duckduckgo.com]]
        const text = nonHTML(node.description ?? node.value);
        const url =
          node.protocol === "internal"
            ? "#" + slugify(node.value)
            : transformLinkUri(props.displayURL, props.baseURL)(node.value);
        const title = node.text;
        return `<a${url ? ` href="${url}"` : ""}${
          title ? ` title="${title}"` : ""
        }>${text}</a>`;
      }
      case "newline":
        return "";
    }
    return `TODO: phrasingContent: ${node.type}`;
  }

  function anyToHTML(node: Content | Token): string {
    if (isToken(node)) {
      return tokenToHTML(node);
    }
    return contentToHTML(node);
  }

  function listItemToHTML(node: ListItem): string {
    const content = node.children.slice(1);
    return `<li>${content
      .map((c) => anyToHTML(c as Content | Token))
      .join("")}</li>`;
  }

  function topLevelContentToHTML(node: TopLevelContent): string {
    switch (node.type) {
      case "keyword":
      case "footnote":
        return `TODO: topLevelContent: ${node.type}`;
    }
    return contentToHTML(node);
  }

  function mkHeaderHTML(level: number, text: string, slug: string): string {
    return `<h${level}>
  <a name="${slug}" class="anchor" href="#${slug}">
    <span class="octicon-link"></span>
  </a>
  ${text}
</h${level}>`;
  }

  function contentToHTML(node: Content): string {
    switch (node.type) {
      case "section": {
        // treating this as a headline, first child should be headline content
        return node.children.map(contentToHTML).join("");
      }
      case "paragraph": {
        const lines: string[] = node.children.map((c) =>
          phrasingContentToHTML(c)
        );
        return `<p>${lines.filter((l) => l !== " ").join("\n")}</p>`;
      }
      case "headline": {
        const level = node.level;
        const contentChildren = node.children.slice(1);
        const slug = slugify(contentChildren.map((c) => c.value).join(""));
        const headingContent: string = contentChildren
          .map((c) => tokenToHTML(c as Token))
          .join("");
        return mkHeaderHTML(level, headingContent, slug);
      }
      case "hr": {
        return "<hr>";
      }
      case "html": {
        return dompurify.sanitize(node.value);
      }
      case "block": {
        if (node.name === "EXPORT" && node.params.includes("html")) {
          return dompurify.sanitize(node.value);
        }
        if (node.name === "SRC" && node.params.length > 0) {
          const language = node.params[0];
          const markup = renderToStaticMarkup(
            <RawCodeBlock
              code={node.value}
              language={language as any}
              disablePrefixes={true}
              enableLineRef={false}
            />
          );
          return `<pre>${markup}</pre>`;
        }
        return `TODO: content: block { name = ${node.name}; params = ${node.params} }`;
      }
      case "list": {
        if (!node.ordered) {
          const items: string[] = node.children.map(listItemToHTML);
          return `<ul>${items.join("")}</ul>`;
        }
      }
    }
    return `TODO: content: ${node.type}`;
  }

  const body = node.children.map(topLevelContentToHTML).join("");

  if ("title" in node.properties) {
    const title = node.properties.title;
    return mkHeaderHTML(1, title, slugify(title)) + body;
  }
  return body;
}

function Org(props: MarkupProps, testing = false): React.ReactElement | null {
  if (!testing) {
    scrollEffect();
  }

  if (!props.source) {
    return null;
  }

  try {
    const raw = orgToHTML(props, parseSource(props.source));
    return markup(props, raw);
  } catch (err) {
    console.log(err);
    return null;
  }
}

export default Org;
