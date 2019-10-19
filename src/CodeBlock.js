import React from "react";
import Lowlight from "react-lowlight";
import js from "highlight.js/lib/languages/javascript";

Lowlight.registerLanguage("js", js);

function CodeBlock(props) {
  return (
    <Lowlight
      language={props.language || "js"}
      value={props.literal}
      inline={props.inline}
    />
  );
}

export default CodeBlock;
