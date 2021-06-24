/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import marked, { Renderer } from "marked";
import dompurify from "dompurify";
import { RawCodeBlock } from "./CodeBlock";
import { replaceEmojis } from "../util/emoji_util";
import { markup, MarkupProps, scrollEffect, slugify } from "./Markup";

function isRelative(path: string): boolean {
  return (
    !path.startsWith("/") &&
    !path.startsWith("https://") &&
    !path.startsWith("http://") &&
    !path.startsWith("//")
  );
}

function relativeToAbsolute(base: string, relative: string): string {
  const baseURL = new URL(base);
  baseURL.search = "";
  baseURL.hash = "";
  const parts = baseURL.pathname.split("/");
  parts[parts.length - 1] = relative;
  baseURL.pathname = parts.join("/");
  return baseURL.href;
}

function Markdown(props: MarkupProps): React.ReactElement | null {
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
              props.baseURL
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
            />
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

function transformLinkUri(displayURL: string, baseURL: string) {
  return (uri: string) => {
    let href = uri;

    if (uri.startsWith("#")) return uri;

    // If the URL is relative, it should be relative to the canonical URL of the file.
    if (isRelative(href)) {
      // https://github.com/denoland/deno_website2/issues/1047
      href = decodeURIComponent(relativeToAbsolute(displayURL, href));
    }
    if (href.startsWith("/") && !href.startsWith("//")) {
      href = `${baseURL}${href}`;
    }

    const hrefURL = new URL(href);

    // Manual links should not have trailing .md
    if (
      hrefURL?.pathname?.startsWith("/manual") &&
      hrefURL?.origin === "https://deno.land"
    ) {
      hrefURL.pathname = hrefURL.pathname.replace(/\.md$/, "");
      href = hrefURL.href;
    }

    return href;
  };
}

function transformImageUri(sourceURL: string) {
  return (uri: string) => {
    if (isRelative(uri)) {
      return relativeToAbsolute(sourceURL, uri);
    }
    return uri;
  };
}

export default Markdown;
