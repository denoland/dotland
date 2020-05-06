/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import React, { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import CodeBlock from "./CodeBlock";
import InlineCode from "./InlineCode";
import { useRouter } from "next/router";

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
}

// Use next.js Link
function LinkRenderer(props: LinkRendererProps) {
  const { asPath } = useRouter();
  const currentPath = new URL(asPath, location.origin).pathname;
  let href: string | undefined = undefined;
  if (props.href) {
    if (props.href.startsWith("#")) {
      href = props.href;
    } else if (props.href.startsWith("./") || props.href.startsWith("../")) {
      href = currentPath + "/" + props.href;
    } else {
      href = props.href;
    }
  }
  return (
    <a href={href} className="link">
      {props.children}
    </a>
  );
}

function CodeRenderer(props: any) {
  return <CodeBlock {...{ ...props, code: props.value, value: undefined }} />;
}

function ImageRenderer(props: any) {
  return <img {...{ ...props }} className="max-w-full inline-block" />;
}

const renderers = {
  inlineCode: InlineCode,
  code: CodeRenderer,
  heading: HeadingRenderer,
  link: LinkRenderer,
  image: ImageRenderer,
};

interface MarkdownProps {
  source: string;
}

// TODO(lucacasonato): add anchor points to headers
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
      renderers={renderers}
      skipHtml={true}
      className="markdown"
    />
  );
}

export default Markdown;
