import React from "react";
import ReactMarkdown from "react-markdown";
import toc from "remark-toc";
import CodeBlock from "./CodeBlock";
import htmlParser from "react-markdown/plugins/html-parser";

// We want to allow HTML in markdown, but not anything unsafe like script tags.
// https://github.com/aknuds1/html-to-react#with-custom-processing-instructions
const parseHtml = htmlParser({
  isValidNode: (node: any) => node.type !== "script"
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

interface Props {
  source: string;
  children: any;
  level: any;
}

function HeadingRenderer(props: Props) {
  const children = React.Children.toArray(props.children);
  const text = children.reduce(flatten, "");
  const id = slugify(text);
  return React.createElement("h" + props.level, { id }, props.children);
}

const renderers = { code: CodeBlock, heading: HeadingRenderer };

function Markdown(props: Props) {
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
