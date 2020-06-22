/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import React, { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import CodeBlock from "./CodeBlock";
import InlineCode from "./InlineCode";

interface HeadingRendererProps {
  source: string;
  children?: any;
  level?: any;
}

function flatten(text: any, child: any): any {
  return typeof child === "string"
    ? text + child
    : React.Children.toArray(child.props.children).reduce(flatten, text);
}

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

function HeadingRenderer(props: HeadingRendererProps) {
  const children = React.Children.toArray(props.children);
  const text = children.reduce(flatten, "");
  const id = slugify(text);
  return React.createElement(
    "h" + props.level,
    { id },
    <a href={"#" + id} className="hover:underline">
      {props.children}
    </a>
  );
}

interface LinkRendererProps {
  children?: any;
  href?: string;
  displayURL: string;
}

function isRelative(path: string): boolean {
  return (
    !path.startsWith("/") &&
    !path.startsWith("https://") &&
    !path.startsWith("http://") &&
    !path.startsWith("//")
  );
}

function relativeToAbsolute(base: string, relative: string): string {
  const baseURL = new URL(base);
  baseURL.search = "";
  baseURL.hash = "";
  const parts = baseURL.pathname.split("/");
  parts[parts.length - 1] = relative;
  baseURL.pathname = parts.join("/");
  return baseURL.href;
}

function LinkRenderer(props: LinkRendererProps) {
  let href = props.href;

  // If the URL is relative, it should be relative to the canonical URL of the file.
  if (href !== undefined && isRelative(href)) {
    // https://github.com/denoland/deno_website2/issues/1047
    href = decodeURIComponent(relativeToAbsolute(props.displayURL, href));
  }

  const hrefURL = href ? new URL(href) : undefined;

  // Manual links should not have trailing .md
  if (
    hrefURL?.pathname?.startsWith("/manual") &&
    hrefURL?.origin === location.origin
  ) {
    hrefURL.pathname = hrefURL.pathname.replace(/\.md$/, "");
    href = hrefURL.href;
  }

  // TODO(lucacasonato): Use next.js Link
  return (
    <a href={href} className="link">
      {props.children}
    </a>
  );
}

function CodeRenderer(props: any) {
  return <CodeBlock {...{ ...props, code: props.value, value: undefined }} />;
}

function ImageRenderer(props: {
  src: string;
  sourceURL: string;
  displayURL: string;
}) {
  let src = props.src;
  const className = "max-w-full inline-block";
  const isManual = new URL(props.displayURL).pathname.startsWith("/manual");

  if (isRelative(src)) {
    src = relativeToAbsolute(props.sourceURL, src);
  }

  return isManual ? (
    <a href={src} className={className}>
      <img src={src} />
    </a>
  ) : (
    <img className={className} src={src} />
  );
}

const renderers = (displayURL: string, sourceURL: string) => ({
  inlineCode: InlineCode,
  code: CodeRenderer,
  heading: HeadingRenderer,
  link: function LinkRendererWrapper(props: any) {
    return <LinkRenderer {...props} displayURL={displayURL} />;
  },
  image: function ImageRendererWrapper(props: any) {
    return (
      <ImageRenderer {...props} sourceURL={sourceURL} displayURL={displayURL} />
    );
  },
  table: function TableRenderer(props: any) {
    return (
      <div className="overflow-x-auto">
        <table {...props} />
      </div>
    );
  },
});

interface MarkdownProps {
  source: string;
  displayURL: string;
  sourceURL: string;
}

function Markdown(props: MarkdownProps) {
  useEffect(() => {
    let { hash } = location;
    hash = hash && hash.substring(1);
    if (!hash) return;

    const el = document.getElementById(hash);
    if (!el) return;

    setTimeout(() => el.scrollIntoView(), 0);
  }, []);

  if (!props.source) {
    return null;
  }
  return (
    <ReactMarkdown
      source={props.source}
      renderers={renderers(props.displayURL, props.sourceURL)}
      skipHtml={true}
      className="markdown"
    />
  );
}

export default Markdown;
