import React from "react";
import SyntaxHighlighter from "react-syntax-highlighter";

function CodeBlock(props) {
  return (
    <SyntaxHighlighter language={props.language || "js"}>
      {props.value}
    </SyntaxHighlighter>
  );
}

export default CodeBlock;
