import React from "react";
import ReactMarkdown from "react-markdown";
import CodeBlock from "./CodeBlock";

function Markdown(props) {
  return (
    <ReactMarkdown source={props.source} renderers={{ code: CodeBlock }} />
  );
}

export default Markdown;
