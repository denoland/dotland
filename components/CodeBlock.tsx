// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, h, htmlEscape, Prism } from "../deps.ts";
import { normalizeTokens } from "../util/prism_utils.ts";

import "https://esm.sh/prismjs@1.25.0/components/prism-bash?pin=v76&no-check";
import "https://esm.sh/prismjs@1.25.0/components/prism-batch?pin=v76&no-check";
import "https://esm.sh/prismjs@1.25.0/components/prism-css?pin=v76&no-check";
import "https://esm.sh/prismjs@1.25.0/components/prism-css-extras?pin=v76&no-check";
import "https://esm.sh/prismjs@1.25.0/components/prism-editorconfig?pin=v76&no-check";
import "https://esm.sh/prismjs@1.25.0/components/prism-diff?pin=v76&no-check";
import "https://esm.sh/prismjs@1.25.0/components/prism-docker?pin=v76&no-check";
import "https://esm.sh/prismjs@1.25.0/components/prism-git?pin=v76&no-check";
import "https://esm.sh/prismjs@1.25.0/components/prism-ignore?pin=v76&no-check";
import "https://esm.sh/prismjs@1.25.0/components/prism-javascript?pin=v76&no-check";
import "https://esm.sh/prismjs@1.25.0/components/prism-js-extras?pin=v76&no-check";
import "https://esm.sh/prismjs@1.25.0/components/prism-js-templates?pin=v76&no-check";
//import "https://esm.sh/prismjs@1.25.0/components/prism-jsdoc?no-check";
import "https://esm.sh/prismjs@1.25.0/components/prism-json?pin=v76&no-check";
import "https://esm.sh/prismjs@1.25.0/components/prism-jsx?pin=v76&no-check";
import "https://esm.sh/prismjs@1.25.0/components/prism-markdown?pin=v76&no-check";
import "https://esm.sh/prismjs@1.25.0/components/prism-rust?pin=v76&no-check";
import "https://esm.sh/prismjs@1.25.0/components/prism-toml?pin=v76&no-check";
import "https://esm.sh/prismjs@1.25.0/components/prism-tsx?pin=v76&no-check";
import "https://esm.sh/prismjs@1.25.0/components/prism-typescript?pin=v76&no-check";
import "https://esm.sh/prismjs@1.25.0/components/prism-yaml?pin=v76&no-check";

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
    <div
      data-color-mode="light"
      data-light-theme="light"
      class="markdown-body "
    >
      <pre
        class={`highlight highlight-source-${newLang} flex ${
          extraClassName ?? ""
        }`}
      >
        {enableLineRef &&
          (
            <div class={codeDivClasses}>
              {tokens.map((_, i) => (
                <div
                  class="token text-right"
                  onClick={`location.hash = "#L${i + 1}"`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          )}
        {!disablePrefixes && (newLang === "bash") &&
          (
            <code>
              <div class={codeDivClasses}>$</div>
            </code>
          )}
        <div class="block w-full overflow-y-auto">
          {tokens.map((line, i) => {
            return (
              <span id={"L" + (i + 1)} class="block">
                {line.map((token) => {
                  if (token.empty) {
                    return <br />;
                  }
                  return (
                    <span class={"token " + token.types.join(" ")}>
                      {token.content}
                    </span>
                  );
                })}
              </span>
            );
          })}
        </div>
      </pre>
    </div>
  );
}

export function CodeBlock({ code, language, disablePrefixes }: CodeBlockProps) {
  return (
    <RawCodeBlock
      code={code}
      language={language}
      disablePrefixes={disablePrefixes}
      class="p-4"
    />
  );
}
