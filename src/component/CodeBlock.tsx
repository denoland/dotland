import React from "react";
import SyntaxHighlighter, {
  SyntaxHighlighterProps
} from "react-syntax-highlighter";
import lightTheme from "react-syntax-highlighter/dist/cjs/styles/hljs/atom-one-light";
import darkTheme from "react-syntax-highlighter/dist/cjs/styles/hljs/atom-one-dark";
import { useDarkMode } from "../hook/theme";

lightTheme["hljs-selection"] = {
  backgroundColor: "#ebebeb" // https://github.com/atom/one-light-ui/blob/master/styles/ui-variables.less#L32
};
darkTheme["hljs-selection"] = {
  backgroundColor: "#3a404b" // https://github.com/atom/one-dark-ui/blob/master/styles/ui-variables.less#L32
};

function CodeBlock(props: SyntaxHighlighterProps) {
  const darkMode = useDarkMode();
  return (
    <SyntaxHighlighter
      style={darkMode ? darkTheme : lightTheme}
      language={props.language || "js"}
      showLineNumbers={props.showLineNumbers || false}
      wrapLines={true}
      lineProps={props.lineProps}
    >
      {props.value}
    </SyntaxHighlighter>
  );
}

export default CodeBlock;
