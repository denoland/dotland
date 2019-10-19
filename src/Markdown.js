import React from "react";
import ReactMarkdown from "react-markdown";
import CodeBlock from "./CodeBlock";

const renderers = { code: CodeBlock };

function Markdown(props) {
  return <ReactMarkdown source={props.source} renderers={renderers} />;
}

export default Markdown;
