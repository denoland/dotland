import React from "react";
import ReactMarkdown from "react-markdown";
import toc from "remark-toc";
import CodeBlock from "./CodeBlock";

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
    />
  );
}

export default Markdown;
