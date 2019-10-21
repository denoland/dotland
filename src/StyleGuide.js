import React from "react";
import Markdown from "./Markdown";
import d from "./style_guide.md";

// TODO showdown_toc

function StyleGuide() {
  const [state, setState] = React.useState({ markdown: "loading" });

  React.useEffect(() => {
    fetch(d).then(async response => {
      const m = await response.text();
      setState({ markdown: m });
    });
  }, []);

  return (
    <div>
      <a href="/">
        <img
          alt="deno logo"
          src="https://denolib.github.io/animated-deno-logo/deno-circle-thunder.gif"
          width="200"
        />
      </a>
      <Markdown source={state.markdown} />
    </div>
  );
}

export default StyleGuide;
