/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import React from "react";
import Highlight, { Prism } from "prism-react-renderer";
import light from "prism-react-renderer/themes/github";

export interface CodeBlockProps {
  code: string;
  language:
    | "javascript"
    | "typescript"
    | "jsx"
    | "tsx"
    | "json"
    | "yaml"
    | "markdown"
    | "bash"
    | "text";
}

export const RawCodeBlock = ({
  code,
  language,
  className: extraClassName,
}: CodeBlockProps & { className?: string }) => {
  return (
    <Highlight
      Prism={Prism}
      theme={light}
      code={code}
      language={language === "text" ? "diff" : language}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={
            className + " flex overflow-y-auto " + (extraClassName ?? "")
          }
          style={{ ...style }}
        >
          {tokens.length === 1 && language == "bash" && (
            <code className="pr-2 sm:pr-3">
              <div className="text-gray-400 token-line text-right select-none">
                $
              </div>
            </code>
          )}
          {tokens.length > 1 && (
            <code className="pr-2 sm:pr-3">
              {tokens.map((line, i) => (
                <div
                  key={i + "l"}
                  className="text-gray-400 token-line text-right select-none"
                >
                  {i + 1}{" "}
                </div>
              ))}
            </code>
          )}
          <code>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line, key: i })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </code>
        </pre>
      )}
    </Highlight>
  );
};

const CodeBlock = ({ code, language }: CodeBlockProps) => {
  return (
    <RawCodeBlock
      code={code}
      language={language}
      className="rounded border border-gray-200 p-1 px-2 sm:px-3"
    />
  );
};

export default CodeBlock;
