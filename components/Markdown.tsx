/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import React from "react";
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
  return React.createElement("h" + props.level, { id }, props.children);
}

interface LinkRendererProps {
  children?: any;
  href?: string;
}

function LinkRenderer(props: LinkRendererProps) {
  const children = React.Children.toArray(props.children);
  return (
    <a href={props.href} className="link">
      {children}
    </a>
  );
}

function CodeRenderer(props: any) {
  return (
    <div className="pb-2">
      <CodeBlock {...{ ...props, code: props.value, value: undefined }} />
    </div>
  );
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
