// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
import { h, htmlEscape, Prism, PrismTheme, sanitizeHtml } from "../deps.ts";

import "https://esm.sh/prismjs@1.25.0/components/prism-bash?no-check";
//import "https://esm.sh/prismjs@1.25.0/components/prism-batch?no-check";
import "https://esm.sh/prismjs@1.25.0/components/prism-css?no-check";
//import "https://esm.sh/prismjs@1.25.0/components/prism-css-extras?no-check";
//import "https://esm.sh/prismjs@1.25.0/components/prism-editorconfig?no-check";
import "https://esm.sh/prismjs@1.25.0/components/prism-diff?no-check";
//import "https://esm.sh/prismjs@1.25.0/components/prism-docker?no-check";
//import "https://esm.sh/prismjs@1.25.0/components/prism-git?no-check";
//import "https://esm.sh/prismjs@1.25.0/components/prism-ignore?no-check";
import "https://esm.sh/prismjs@1.25.0/components/prism-javascript?no-check";
//import "https://esm.sh/prismjs@1.25.0/components/prism-js-extras?no-check";
//import "https://esm.sh/prismjs@1.25.0/components/prism-js-templates?no-check";
//import "https://esm.sh/prismjs@1.25.0/components/prism-jsdoc?no-check";
import "https://esm.sh/prismjs@1.25.0/components/prism-json?no-check";
import "https://esm.sh/prismjs@1.25.0/components/prism-jsx?no-check";
//import "https://esm.sh/prismjs@1.25.0/components/prism-markdown?no-check";
import "https://esm.sh/prismjs@1.25.0/components/prism-rust?no-check";
//import "https://esm.sh/prismjs@1.25.0/components/prism-toml?no-check";
import "https://esm.sh/prismjs@1.25.0/components/prism-tsx?no-check";
import "https://esm.sh/prismjs@1.25.0/components/prism-typescript?no-check";
import "https://esm.sh/prismjs@1.25.0/components/prism-yaml?no-check";

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
  const codeDivClassNames =
    "text-gray-300 token-line text-right select-none inline-block";
  const newLang = language === "shell"
    ? "bash"
    : language === "text"
    ? "diff"
    : language;
  const grammar = Object.hasOwnProperty.call(Prism.languages, newLang)
    ? Prism.languages[newLang]
    : undefined;

  if (grammar === undefined) {
    return (
      <div>
        <code dangerouslySetInnerHTML={{ __html: htmlEscape(code) }} />
      </div>
    );
  }

  //Prism.hooks.add("wrap", (x) => {});
  let html = Prism.highlight(code, grammar, language);
  if (!disablePrefixes && (language === "bash" || language === "shell")) {
    html =
      `<code class="pr-2 sm:pr-3"><div class="${codeDivClassNames}">$</div></code>` +
      html;
  }

  const __html = sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      "img",
      "video",
      "svg",
      "path",
    ]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ["src", "alt", "height", "width", "align"],
      video: [
        "src",
        "alt",
        "height",
        "width",
        "autoplay",
        "muted",
        "loop",
        "playsinline",
      ],
      a: ["id", "aria-hidden", "href", "tabindex", "rel"],
      svg: ["viewbox", "width", "height", "aria-hidden"],
      path: ["fill-rule", "d"],
      h1: ["id"],
      h2: ["id"],
      h3: ["id"],
      h4: ["id"],
      h5: ["id"],
      h6: ["id"],
    },
    allowedClasses: {
      code: ["pr-2", "sm:pr-3"],
      div: ["highlight", ...codeDivClassNames.split(" ")],
      span: [
        "token",
        "keyword",
        "operator",
        "number",
        "boolean",
        "function",
        "string",
        "comment",
        "class-name",
        "regex",
        "regex-delimiter",
        "tag",
        "attr-name",
        "punctuation",
        "script-punctuation",
        "script",
        "plain-text",
        "property",
      ],
      a: ["anchor"],
      svg: ["octicon", "octicon-link"],
    },
    allowProtocolRelative: false,
  });
  return (
    <div
      data-color-mode="light"
      data-light-theme="light"
      class="markdown-body"
    >
      <pre
        dangerouslySetInnerHTML={{ __html }}
        class={`overflow-y-auto highlight highlight-source-${newLang} ${
          extraClassName ?? ""
        }`}
      />
    </div>
  );
  /*return (
    <Highlight
      Prism={Prism}
      theme={PrismTheme}
      code={code}
      language={language === "shell"
        ? "bash"
        : language === "text"
        ? "diff"
        : language}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          class={className + " flex overflow-y-auto " +
            (extraClassName ?? "")}
          style={{ ...style }}
        >
          {!disablePrefixes &&
            tokens.length === 1 &&
            (language === "bash" || language === "shell") &&
            (
              <code class="pr-2 sm:pr-3">
                <div class={codeDivClassNames}>
                  $
                </div>
              </code>
            )}
          {tokens.length > 1 && !disablePrefixes &&
            (
              <code class="pr-2 sm:pr-3">
                {tokens.map((line, i) =>
                  line[0]?.empty && i === tokens.length - 1
                    ? null
                    : (
                      <div key={i + "l"} class={codeDivClassNames}>
                        {enableLineRef
                          ? (
                            <a id={`L${i + 1}`} href={`#L${i + 1}`}>
                              {i + 1}
                              {" "}
                            </a>
                          )
                          : (
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
                    i + 1,
                  )
              ) {
                lineProps.className = `${lineProps.className} highlight-line`;
              }
              return line[0]?.empty && i === tokens.length - 1
                ? null
                : (
                  <div key={i} {...lineProps}>
                    {line.map((
                      token,
                      key,
                    ) => <span key={key} {...getTokenProps({ token, key })} />)}
                  </div>
                );
            })}
          </code>
        </pre>
      )}
    </Highlight>
  );*/
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
