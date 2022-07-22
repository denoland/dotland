// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
import { h } from "preact";

import { tw } from "@twind";
import { Prism } from "@/util/prism_utils.ts";
import { escape as htmlEscape } from "$he";
import { normalizeTokens } from "@/util/prism_utils.ts";
import { fileTypeFromURL, filetypeIsJS } from "../util/registry_utils.ts";

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
}

export function RawCodeBlock({
  code,
  language,
  class: extraClassName,
  disablePrefixes,
  enableLineRef = false,
  url,
}: CodeBlockProps & {
  class?: string;
  enableLineRef?: boolean;
}) {
  const codeDivClasses = tw
    `text-gray-300 text-right select-none inline-block mr-2 sm:mr-3`;
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

  return (
    <pre
      className={tw`text-sm gfm-highlight highlight-source-${newLang} flex ${
        extraClassName ?? ""
      }`}
      data-color-mode="light"
      data-light-theme="light"
    >
      {enableLineRef &&
        (
          <div className={codeDivClasses}>
            {tokens.map((_, i) => (
              <a
                className={tw`text-gray-500 token text-right block`}
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
                  try {
                    const urlContent = token.content.slice(1, -1);
                    const res = new URL(
                      urlContent,
                      filetypeIsJS(fileTypeFromURL(urlContent))
                        ? url
                        : undefined,
                    );

                    return (
                      <a
                        className={tw`hover:underline` + " token " +
                          token.types.join(" ")}
                        href={res.href + "?code"}
                      >
                        {token.content}
                      </a>
                    );
                  } catch (e) {
                    // ignore
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
    </pre>
  );
}

export function CodeBlock(
  { code, language, disablePrefixes, url }: CodeBlockProps,
) {
  return (
    <RawCodeBlock
      code={code}
      language={language}
      disablePrefixes={disablePrefixes}
      class={tw`p-4 bg-gray-100 rounded-lg`}
      url={url}
    />
  );
}
