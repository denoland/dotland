/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import React from "react";
import Highlight, { Prism } from "prism-react-renderer";
import light from "prism-react-renderer/themes/github";

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
    | "text";
}

export const RawCodeBlock = ({
  code,
  language,
  className: extraClassName,
  disablePrefixes,
}: CodeBlockProps & { className?: string }) => {
  return (
    <Highlight
      Prism={Prism}
      theme={light}
      code={code}
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
                <div className="text-gray-400 token-line text-right select-none">
                  $
                </div>
              </code>
            )}
          {tokens.length > 1 && !disablePrefixes && (
            <code className="pr-2 sm:pr-3">
              {tokens.map(
                (line, i) =>
                  !(
                    // Hide blank line at EOF
                    (
                      i === tokens.length - 1 && // Is last line
                      line.length === 1 && // Is one token long
                      getTokenProps({ token: line[0], key: 0 }).className ===
                        "token plain"
                    ) // The only token is blank
                  ) && (
                    <div
                      key={i + "l"}
                      className="text-gray-400 token-line text-right select-none"
                    >
                      {i + 1}{" "}
                    </div>
                  )
              )}
            </code>
          )}
          <code>
            {tokens.map(
              (line, i) =>
                !(
                  i === tokens.length - 1 &&
                  line.length === 1 &&
                  getTokenProps({ token: line[0], key: 0 }).className ===
                    "token plain"
                ) && (
                  <div key={i} {...getLineProps({ line, key: i })}>
                    {line.length === 1 && // Preserve line break
                    getTokenProps({ token: line[0], key: 0 }).className ===
                      "token plain" ? (
                      <span {...getTokenProps({ token: line[0], key: 0 })}>
                        {"\n"}
                      </span>
                    ) : (
                      line.map((token, key) => (
                        <span key={key} {...getTokenProps({ token, key })} />
                      ))
                    )}
                  </div>
                )
            )}
          </code>
        </pre>
      )}
    </Highlight>
  );
};

const CodeBlock = ({ code, language, disablePrefixes }: CodeBlockProps) => {
  return (
    <RawCodeBlock
      code={code}
      language={language}
      disablePrefixes={disablePrefixes}
      className="rounded border border-gray-200 p-1 px-2 sm:px-3"
    />
  );
};

export default CodeBlock;

