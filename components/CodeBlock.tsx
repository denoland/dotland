// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
import { h, tw } from "../deps.ts";
import { htmlEscape, Prism } from "../server_deps.ts";
import { normalizeTokens } from "../util/prism_utils.ts";

// Modifies the color of 'variable' token
// to avoid poor contrast
// ref: https://github.com/denoland/dotland/issues/1724
/*
for (const style of light.styles) {
  if (style.types.includes("variable")) {
    // Chrome suggests this color instead of rgb(156, 220, 254);
    style.style.color = "rgb(61, 88, 101)";
  }
}
*/

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
  class: extraClassName,
  disablePrefixes,
  enableLineRef = false,
}: CodeBlockProps & {
  class?: string;
  enableLineRef?: boolean;
}) {
  const codeDivClasses =
    "text-gray-300 text-right select-none inline-block mr-2 sm:mr-3";
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

export function CodeBlock({ code, language, disablePrefixes }: CodeBlockProps) {
  return (
    <RawCodeBlock
      code={code}
      language={language}
      disablePrefixes={disablePrefixes}
      class={tw`p-4`}
    />
  );
}
