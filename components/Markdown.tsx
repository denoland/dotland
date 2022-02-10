/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

/** @jsx h */
import { h, useEffect } from "../deps.ts";
import { renderToStaticMarkup } from "preact/compat/server";
import marked, { Renderer } from "marked";
import dompurify from "dompurify";
import { RawCodeBlock } from "./CodeBlock.tsx";
import { replaceEmojis } from "../util/emoji_util.ts";
import {
  markup,
  MarkupProps,
  scrollEffect,
  slugify,
  transformImageUri,
  transformLinkUri,
} from "./Markup.tsx";

export function Markdown(props: MarkupProps): any {
  scrollEffect();

  if (!props.source) {
    return null;
  }

  try {
    marked.use({
      renderer: ({
        heading(text: string, level: number) {
          const slug = slugify(text);
          return `
          <h${level}>
            <a name="${slug}" class="anchor" href="#${slug}">
              <span class="octicon-link"></span>
            </a>
            ${text}
          </h${level}>`;
        },
        link(href, title, text) {
          const url = href
            ? transformLinkUri(props.displayURL, props.baseURL)(href)
            : "";
          return `<a ${url ? `href="${url}"` : ""} ${
            title ? `title="${title}"` : ""
          }>${text}</a>`;
        },
        image(href, title, text) {
          const url = href ? transformImageUri(props.sourceURL)(href) : "";
          return `<img ${url ? `src="${url}"` : ""} ${
            text ? `alt="${text}"` : ""
          } ${title ? `title="${title}"` : ""} style="max-width:100%;">`;
        },
        html(html: string) {
          const images: RegExpMatchArray[] = [
            ...html.matchAll(/src="([^"]*)"/g),
          ];
          images.forEach((a) => {
            const original = a[1];
            const final = transformImageUri(props.sourceURL)(original);
            html = html.replace(`src="${original}"`, `src="${final}"`);
          });
          const links: RegExpMatchArray[] = [
            ...html.matchAll(/href="([^"]*)"/g),
          ];
          links.forEach((a) => {
            const original = a[1];
            const final = transformLinkUri(
              props.displayURL,
              props.baseURL,
            )(original);
            html = html.replace(`href="${original}"`, `href="${final}"`);
          });
          return html;
        },
        text(text) {
          return replaceEmojis(text);
        },
        code(code, language) {
          const markup = renderToStaticMarkup(
            <RawCodeBlock
              code={code}
              language={language as any}
              disablePrefixes={true}
              enableLineRef={false}
            />,
          );
          return `<pre>${markup}</pre>`;
        },
      } as Partial<Renderer>) as any,
    });

    const raw = marked(props.source, {
      gfm: true,
      headerIds: true,
      sanitizer: dompurify.sanitize,
    });
    return markup(props, raw);
  } catch (err) {
    console.log(err);
    return null;
  }
}
