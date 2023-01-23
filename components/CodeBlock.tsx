// Copyright 2022-2023 the Deno authors. All rights reserved. MIT license.

// deno-fmt-ignore-file
import { escape as htmlEscape } from "$he";
import { normalizeTokens, Prism } from "@/util/prism_utils.ts";
import { extractLinkUrl } from "@/util/registry_utils.ts";
import * as Icons from "./Icons.tsx";

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
  enableCopyButton?: boolean;
}

export function RawCodeBlock({
  code,
  language,
  class: extraClassName,
  disablePrefixes,
  enableLineRef = false,
  enableCopyButton = false,
  url,
}: CodeBlockProps & {
  enableLineRef?: boolean;
}) {
  const codeDivClasses = "text-gray-300 text-right select-none inline-block mr-2 sm:mr-3";
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

  // The copy button is bigger than a single line, so if the copy button
  // is enabled we need to center the content.
  let flexCenter = "";
  if (enableCopyButton && tokens.length == 1) {
    flexCenter = "items-center";
  }

  return (
    <pre
      class={
        `group text-sm flex ${extraClassName ?? ""} gfm-highlight highlight-source-${newLang} ${flexCenter}`}
      data-color-mode="light"
      data-light-theme="light"
    >
      {enableLineRef &&
        (
          <div class={codeDivClasses}>
            {tokens.map((_, i) => (
              <a
                class="text-gray-500 text-right block token"
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

                if (token.types.includes("string")) {
                  const result = extractLinkUrl(
                    token.content,
                    url.origin + url.pathname,
                  );
                  if (result) {
                    const [href, specifier, quote] = result;
                    return (
                      <span
                        class={"token " +
                          token.types.join(" ")}
                      >
                        {quote}
                        <a
                          class="hover:underline"
                          href={href + "?source"}
                        >
                          {specifier}
                        </a>
                        {quote}
                      </span>
                    );
                  }
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
      {enableCopyButton &&
      (
        <button
          class="opacity-0 group-hover:opacity-100 rounded border border-[#D2D2DC] p-1.5 self-start"
          // @ts-ignore onClick does support strings
          onClick={`navigator?.clipboard?.writeText('${code.trim()}');`}
        >
          <Icons.Copy />
        </button>
      )}
    </pre>
  );
}

export function CodeBlock(props: CodeBlockProps) {
  return (
    <RawCodeBlock
      {...props}
      class={`p-4 bg-ultralight rounded-lg ${props.class ?? ""}`}
    />
  );
}
