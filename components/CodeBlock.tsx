// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
import { h } from "preact";

import { tw } from "@twind";
import { Prism } from "@/util/prism_utils.ts";
import { escape as htmlEscape } from "$he";
import { normalizeTokens } from "@/util/prism_utils.ts";
import {
  extractLinkUrl,
  fileTypeFromURL,
  filetypeIsJS,
} from "../util/registry_utils.ts";

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
  url: URL;
  class?: string;
}

export function RawCodeBlock({
  code,
  language,
  class: extraClassName,
  disablePrefixes,
  enableLineRef = false,
  url,
}: CodeBlockProps & {
  enableLineRef?: boolean;
}) {
  const codeDivClasses =
    tw`text-gray-300 text-right select-none inline-block mr-2 sm:mr-3`;
  const newLang = language === "shell"
    ? "bash"
    : language === "text"
    ? "diff"
    : language;
  const grammar = Object.hasOwnProperty.call(Prism.languages, newLang)
    ? Prism.languages[newLang]
    : undefined;

  if (!grammar) {
    return (
      <div>
        <code dangerouslySetInnerHTML={{ __html: htmlEscape(code) }} />
      </div>
    );
  }

  const tokens = normalizeTokens(Prism.tokenize(code, grammar));

  return <pre
    className={tw`text-sm flex ${extraClassName ?? ""}` +
      ` gfm-highlight highlight-source-${newLang}`}
    data-color-mode="light"
    data-light-theme="light"
  >
      {enableLineRef &&
        (
          <div className={codeDivClasses}>
            {tokens.map((_, i) => (
              <a
                className={tw`text-gray-500 text-right block` + " token"}
                tab-index={-1}
                href={`#L${i + 1}`}
              >
                {i + 1}
              </a>
            ))}
          </div>
        )}
      {!disablePrefixes && (newLang === "bash") &&
        (
          <code>
            <div className={codeDivClasses}>$</div>
          </code>
        )}
      <div className={tw`block w-full overflow-y-auto`}>
        {tokens.map((line, i) => {
          return (
            <span id={"L" + (i + 1)} className={tw`block`}>
              {line.map((token) => {
                if (token.empty) {
                  return <br />;
                }

                if (token.types.includes("string")) {
                  const result = extractLinkUrl(
                    token.content,
                    url.origin + url.pathname,
                  );
                  if (result) {
                    const [href, specifier, quote] = result;
                    return (
                      <span
                        className={"token " +
                          token.types.join(" ")}
                      >
                        {quote}
                        <a
                          className={tw`hover:underline`}
                          href={href + "?code"}
                        >
                          {specifier}
                        </a>
                        {quote}
                      </span>
                    );
                  }
                }
                return (
                  <span className={"token " + token.types.join(" ")}>
                    {token.content}
                  </span>
                );
              })}
            </span>
          );
        })}
      </div>
  </pre>;
}

export function CodeBlock(props: CodeBlockProps) {
  return (
    <RawCodeBlock
      {...props}
      class={tw`p-4 bg-ultralight rounded-lg ${props.class ?? ""}`}
    />
  );
}
