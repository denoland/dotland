/* Copyright 2021 the Deno authors. All rights reserved. MIT license. */

import React from "react";
import dompurify from "dompurify";

import unified from "unified";
import parse from "reorg-parse";

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
  Paragraph,
  PhrasingContent,
  Planning,
  Section,
  StyledText,
  Table,
  Token,
} from "orga/dist/types";

function slugify(text: string): string {
  text = text.toLowerCase();
  text = text.split(" ").join("-");
  text = text.split(/\t/).join("--");
  text = text.split(/[|$&`~=\\/@+*!?({[\]})<>=.,;:'"^]/).join("");
  text = text
    .split(/[。？！，、；：“”【】（）〔〕［］﹃﹄“ ”‘’﹁﹂—…－～《》〈〉「」]/)
    .join("");

  return text;
}

interface OrgProps {
  source: string;
  displayURL: string;
  sourceURL: string;
  baseURL: string;
  className?: string;
}

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

function orgToHTML(node: Document): string {
  function nonHTML(text: string) {
    return text
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }

  function wrapped(tag: string, text: string) {
    return `<${tag}>${nonHTML(text)}</${tag}>`;
  }

  function isStyledText(node: Token): node is StyledText {
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
    if (isStyledText(node)) {
      return styledTextToHTML(node);
    }
    return `TODO: token: ${node.type}`;
  }

  function phrasingContentToHTML(node: PhrasingContent): string {
    if (isStyledText(node)) {
      return styledTextToHTML(node);
    }
    switch (node.type) {
      case "link": {
        const text = node.description;
        const url = node.value;
        const title = node.text;
        return `<a${url ? ` href="${url}"` : ""}${
          title ? ` title="${title}"` : ""
        }>${text}</a>`;
      }
    }
    return `TODO: phrasingContent: ${node.type}`;
  }

  function topLevelContentToHTML(node: TopLevelContent): string {
    switch (node.type) {
      case "keyword":
      case "footnote":
        return `TODO: topLevelContent: ${node.type}`;
    }
    return contentToHTML(node);
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
        return `<h${level}>
  <a name="${slug}" class="anchor" href="#${slug}">
    <span class="octicon-link"></span>
  </a>
  ${headingContent}
</h${level}>`;
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
        return `TODO: content: block { name = ${node.name}; params = ${node.params}`;
      }
    }
    return `TODO: content: ${node.type}`;
  }

  return node.children.map(topLevelContentToHTML).join("");
}

function Org(props: OrgProps): React.ReactElement | null {
  if (!props.source) {
    return null;
  }

  try {
    const raw = orgToHTML(parseSource(props.source));
    return React.createElement("div", {
      dangerouslySetInnerHTML: { __html: raw },
      className: `markup py-8 px-4 ${props.className ?? ""}`,
      onClick: { handleClick },
    });
  } catch (err) {
    console.log(err);
    return null;
  }
}

function handleClick(e: React.MouseEvent<HTMLElement>) {
  const el = e.target as HTMLElement;
  if (el.className !== "octicon-link") return;

  const anchor = el.parentNode as HTMLAnchorElement;
  navigator.clipboard.writeText(anchor.href);
}

export default Org;
