import React from "react";
import ReactMarkdown from "react-markdown";
import toc from "remark-toc";
import CodeBlock from "./CodeBlock";

function flatten(text, child) {
  return typeof child === "string"
    ? text + child
    : React.Children.toArray(child.props.children).reduce(flatten, text);
}

function slugify(text) {
  text = text.toLowerCase();
  text = text.split(" ").join("-");
  text = text.split(/\t/).join("--");
  text = text.split(/[|$&`~=\\/@+*!?({[\]})<>=.,;:'"^]/).join("");
  text = text
    .split(/[。？！，、；：“”【】（）〔〕［］﹃﹄“ ”‘’﹁﹂—…－～《》〈〉「」]/)
    .join("");

  return text;
};

function HeadingRenderer(props) {
  const children = React.Children.toArray(props.children);
  const text = children.reduce(flatten, "");
  const id = slugify(text);
  return React.createElement("h" + props.level, { id }, props.children);
}

const renderers = { code: CodeBlock, heading: HeadingRenderer };

function Markdown(props) {
  return (
    <ReactMarkdown
      source={props.source}
      renderers={renderers}
      plugins={[toc]}
    />
  );
}

export default Markdown;
