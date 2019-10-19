// import SyntaxHighlighter from 'react-syntax-highlighter';
import React from "react";
import ReactMarkdown from "react-markdown";
import CodeBlock from "./CodeBlock";
import d from "./manual.md";

// TODO showdown_toc

function Manual() {
  const [state, setState] = React.useState({ markdown: null });
  React.useEffect(() => {
    fetch(d).then(async response => {
      const m = await response.text();
      setState({ markdown: m });
    });
  });
  return (
    <ReactMarkdown source={state.markdown} renderers={{ code: CodeBlock }} />
  );
}

export default Manual;
