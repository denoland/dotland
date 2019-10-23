import React from "react";
import ReactMarkdown from "react-markdown";
import CodeBlock from "./CodeBlock";
const htmlParser = require("react-markdown/plugins/html-parser");

const renderers = { code: CodeBlock };

const parseHtml = htmlParser({
  isValidNode: node => node.type !== "script"
  // more custom instructions if needed in future - https://github.com/aknuds1/html-to-react#with-custom-processing-instructions
  // processingInstructions: [
  //   /* ... */
  // ]
});

function Markdown(props) {
  return (
    <ReactMarkdown
      source={props.source}
      renderers={renderers}
      escapeHtml={false}
      astPlugins={[parseHtml]}
    />
  );
}

export default Markdown;
