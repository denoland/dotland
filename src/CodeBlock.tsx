import React from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import lightTheme from "react-syntax-highlighter/dist/cjs/styles/hljs/atom-one-light";
import darkTheme from "react-syntax-highlighter/dist/cjs/styles/hljs/atom-one-dark";
import { useDarkMode } from "./theme";

interface Props {
  language?: string;
  value: string;
}

function CodeBlock(props: Props) {
  const darkMode = useDarkMode();
  return (
    <SyntaxHighlighter
      style={darkMode ? darkTheme : lightTheme}
      language={props.language || "js"}
    >
      {props.value}
    </SyntaxHighlighter>
  );
}

export default CodeBlock;
