// import SyntaxHighlighter from 'react-syntax-highlighter';
import React from "react";
import { Markdown } from "react-showdown";
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
  const x = state.markdown ? (
    <Markdown markup={state.markdown} />
  ) : (
    <p>loading</p>
  );
  return <main>{x}</main>;
}

export default Manual;
