import React from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import theme from "react-syntax-highlighter/dist/esm/styles/hljs/github-gist";

interface Props {
  language?: string;
  value: string;
}

function CodeBlock(props: Props) {
  return (
    <SyntaxHighlighter style={theme} language={props.language || "js"}>
      {props.value}
    </SyntaxHighlighter>
  );
}

export default CodeBlock;
