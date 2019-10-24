import React from "react";
import ReactMarkdown from "react-markdown";
import CodeBlock from "./CodeBlock";

function flatten(text, child) {
  return typeof child === "string"
    ? text + child
    : React.Children.toArray(child.props.children).reduce(flatten, text);
}

// Using logic from markdown-toc
const slugify = text => {
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
  var children = React.Children.toArray(props.children);
  var text = children.reduce(flatten, "");
  var slug = slugify(text);
  return React.createElement("h" + props.level, { id: slug }, props.children);
}

const renderers = { code: CodeBlock, heading: HeadingRenderer };

function Markdown(props) {
  return <ReactMarkdown source={props.source} renderers={renderers} />;
}

export default Markdown;
