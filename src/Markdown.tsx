import React from "react";
import ReactMarkdown from "react-markdown";
import toc from "remark-toc";
import htmlParser from "react-markdown/plugins/html-parser";
import { Link } from "@material-ui/core";

const { Suspense } = React;

const CodeBlockLazy = React.lazy(() => import("./CodeBlock"));

function CodeBlock(props) {
  return (
    <Suspense fallback={""}>
      <CodeBlockLazy {...props}></CodeBlockLazy>
    </Suspense>
  );
}

interface HeadingRendererProps {
  source: string;
  children?: any;
  level?: any;
}

const allowedTags = [
  "h3",
  "h4",
  "h5",
  "h6",
  "blockquote",
  "p",
  "ul",
  "ol",
  "nl",
  "li",
  "b",
  "i",
  "strong",
  "em",
  "strike",
  "code",
  "hr",
  "br",
  "div",
  "table",
  "thead",
  "caption",
  "tbody",
  "tr",
  "th",
  "td",
  "pre"
];

// We want to allow HTML in markdown, but not anything unsafe like script tags.
// https://github.com/aknuds1/html-to-react#with-custom-processing-instructions
const parseHtml = htmlParser({
  isValidNode: (node: any) => {
    return allowedTags.indexOf(node.type.toLowerCase()) >= 0;
  }
});

function flatten(text: any, child: any) {
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
  return <Link href={props.href}>{children}</Link>;
}

const renderers = {
  code: CodeBlock,
  heading: HeadingRenderer,
  link: LinkRenderer
};

interface MarkdownProps {
  source: string;
}

function Markdown(props: MarkdownProps) {
  if (!props.source) {
    return null;
  }
  return (
    <ReactMarkdown
      source={props.source}
      renderers={renderers}
      plugins={[toc]}
      escapeHtml={false}
      astPlugins={[parseHtml]}
    />
  );
}

export default Markdown;
