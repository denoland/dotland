/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import React, { useEffect, useState } from "react";
import Highlight, { Prism } from "prism-react-renderer";
import light from "prism-react-renderer/themes/github";
import { useLayoutEffect } from "react";

// Modifies the color of 'variable' token
// to avoid poor contrast
// ref: https://github.com/denoland/deno_website2/issues/1724
for (const style of light.styles) {
  if (style.types.includes("variable")) {
    // Chrome suggests this color instead of rgb(156, 220, 254);
    style.style.color = "rgb(61, 88, 101)";
  }
}

(typeof global !== "undefined" ? global : (window as any)).Prism = Prism;

require("prismjs/components/prism-rust");
require("prismjs/components/prism-toml");

export interface CodeBlockProps {
  code: string;
  disablePrefixes?: boolean;
  language:
    | "javascript"
    | "typescript"
    | "jsx"
    | "tsx"
    | "json"
    | "yaml"
    | "markdown"
    | "bash"
    | "shell"
    | "text"
    | "rust"
    | "python"
    | "toml"
    | "wasm"
    | "makefile"
    | "dockerfile";
}

export function RawCodeBlock({
  code,
  language,
  className: extraClassName,
  disablePrefixes,
  enableLineRef = false,
}: CodeBlockProps & {
  className?: string;
  enableLineRef?: boolean;
}): React.ReactElement {
  const [hashValue, setHashValue] = useState("");
  const codeDivClassNames =
    "text-gray-300 token-line text-right select-none text-xs";
  const onClick = (e: React.MouseEvent) => {
    if (e.shiftKey) {
      e.preventDefault();
      const { hash } = location;
      const target = (e.target as HTMLAnchorElement).hash;
      location.hash = hash
        ? hash.replace(/(-.+)?$/, target.replace("#", "-"))
        : target;
    }
  };

  if (enableLineRef) {
    useEffect(() => {
      const onHashChange = () => {
        setHashValue(location.hash);
        const id = location.hash.substring(1);
        document.getElementById(id)?.scrollIntoView();
      };
      window.addEventListener("hashchange", onHashChange);
      onHashChange();
      return () => {
        window.removeEventListener("hashchange", onHashChange);
      };
    }, []);

    useLayoutEffect(() => {
      const parts = hashValue.split("-");
      if (parts.length > 1) {
        const hash = parts
          .map((e) => /([\d]+)/.exec(e)![0])
          .map((e) => parseInt(e, 10))
          .sort((a, b) => a - b)
          .map((e) => `L${e}`);
        if (hash.length) {
          const idEl = document.getElementById(hash[0]);
          if (idEl) {
            idEl.scrollIntoView({ block: "center", behavior: "smooth" });
            return;
          }
        }
      }
    });
  }

  return (
    <Highlight
      Prism={Prism}
      theme={light}
      code={code}
      // @ts-expect-error because typings are bad
      language={
        language === "shell" ? "bash" : language === "text" ? "diff" : language
      }
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={
            className + " flex overflow-y-auto " + (extraClassName ?? "")
          }
          style={{ ...style }}
        >
          {!disablePrefixes &&
            tokens.length === 1 &&
            (language === "bash" || language === "shell") && (
              <code className="pr-2 sm:pr-3">
                <div className={codeDivClassNames}>$</div>
              </code>
            )}
          {tokens.length > 1 && !disablePrefixes && (
            <code className="pr-2 sm:pr-3">
              {tokens.map((line, i) =>
                line[0]?.empty && i === tokens.length - 1 ? null : (
                  <div key={i + "l"} className={codeDivClassNames}>
                    {enableLineRef ? (
                      <a
                        id={`L${i + 1}`}
                        href={`#L${i + 1}`}
                        onClick={enableLineRef && onClick}
                      >
                        {i + 1}{" "}
                      </a>
                    ) : (
                      i + 1
                    )}
                  </div>
                )
              )}
            </code>
          )}
          <code>
            {tokens.map((line, i) => {
              const lineProps = getLineProps({ line, key: i });
              lineProps.className += " text-xs";
              if (
                enableLineRef &&
                hashValue &&
                ((arr, index) =>
                  Math.min(...arr) <= index && index <= Math.max(...arr))(
                  hashValue
                    .split("-")
                    .map((e) => /([\d]+)/.exec(e)![1])
                    .map((n) => parseInt(n, 10)),
                  i + 1
                )
              ) {
                lineProps.className = `${lineProps.className} highlight-line`;
              }
              return line[0]?.empty && i === tokens.length - 1 ? null : (
                <div key={i} {...lineProps}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token, key })} />
                  ))}
                </div>
              );
            })}
          </code>
        </pre>
      )}
    </Highlight>
  );
}

function CodeBlock({
  code,
  language,
  disablePrefixes,
}: CodeBlockProps): React.ReactElement {
  return (
    <RawCodeBlock
      code={code}
      language={language}
      disablePrefixes={disablePrefixes}
      className="p-4"
    />
  );
}

export default CodeBlock;
