/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Router from "next/router";
import Highlight, { Prism } from "prism-react-renderer";
import light from "prism-react-renderer/themes/github";
import { useLayoutEffect } from "react";

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
  enableLineRef = false,
}: CodeBlockProps & { className?: string; enableLineRef?: boolean }) => {
  const [hashValue, setHashValue] = useState("");
  useEffect(() => {
    Router.events.on("hashChangeComplete", (url: any) => {
      setHashValue(url.slice(url.indexOf("#")));
    });
    const { hash } = location;
    setHashValue(hash);
    return () => {
      Router.events.off("hashChangeComplete", () => {});
    };
  }, []);

  useLayoutEffect(() => {
    const hash = hashValue
      .split("-")
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
  });

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
              {tokens.map((line, i) =>
                line[0]?.empty && i === tokens.length - 1 ? null : (
                  <div
                    key={i + "l"}
                    className="text-gray-400 token-line text-right select-none"
                  >
                    {enableLineRef ? (
                      <Link href={`#L${i + 1}`}>
                        <a id={`L${i + 1}`} href={`#L${i + 1}`}>
                          {i + 1}{" "}
                        </a>
                      </Link>
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
                  {line[0]?.empty ? "\n" : ""}
                </div>
              );
            })}
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
