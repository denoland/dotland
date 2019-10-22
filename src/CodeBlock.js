import React from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import theme from "react-syntax-highlighter/dist/esm/styles/hljs/github-gist";

function CodeBlock(props) {
  return (
    <SyntaxHighlighter style={theme} language={props.language || "js"}>
      {props.value}
    </SyntaxHighlighter>
  );
}

export default CodeBlock;
