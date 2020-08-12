/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import React, { useEffect } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import marked, { Renderer } from "marked";
import dompurify from "dompurify";
import { RawCodeBlock } from "./CodeBlock";

function slugify(text: string): string {
  text = text.toLowerCase();
  text = text.split(" ").join("-");
  text = text.split(/\t/).join("--");
  text = text.split(/[|$&`~=\\/@+*!?({[\]})<>=.,;:'"^]/).join("");
  text = text
    .split(/[。？！，、；：“”【】（）〔〕［］﹃﹄“ ”‘’﹁﹂—…－～《》〈〉「」]/)
    .join("");

  return text;
}

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

interface MarkdownProps {
  source: string;
  displayURL: string;
  sourceURL: string;
}

function Markdown(props: MarkdownProps) {
  useEffect(() => {
    let { hash } = location;
    hash = hash && hash.substring(1);
    if (!hash) return;

    const el = document.getElementById(hash);
    if (!el) return;

    setTimeout(() => el.scrollIntoView(), 0);
  }, []);

  if (!props.source) {
    return null;
  }

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
        const url = href ? transformLinkUri(props.displayURL)(href) : "";
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
        const images: RegExpMatchArray[] = [...html.matchAll(/src="([^"]*)"/g)];
        images.forEach((a) => {
          const original = a[1];
          const final = transformImageUri(props.sourceURL)(original);
          console.log(original, final);
          html = html.replace(`src="${original}"`, `src="${final}"`);
        });
        const links: RegExpMatchArray[] = [...html.matchAll(/href="([^"]*)"/g)];
        links.forEach((a) => {
          const original = a[1];
          const final = transformLinkUri(props.displayURL)(original);
          console.log(original, final);
          html = html.replace(`href="${original}"`, `href="${final}"`);
        });
        return html;
      },
    } as Partial<Renderer>) as any,
  });

  const raw = marked(props.source, {
    gfm: true,
    headerIds: true,
    sanitizer: dompurify.sanitize,
    highlight: (code, language) =>
      renderToStaticMarkup(
        <RawCodeBlock
          code={code}
          language={language as any}
          disablePrefixes={true}
          enableLineRef={false}
        />
      ),
  });

  return (
    <div
      dangerouslySetInnerHTML={{ __html: raw }}
      className="markdown-body py-8 px-4"
    />
  );
}

function transformLinkUri(displayURL: string) {
  return (uri: string) => {
    let href = uri;

    // If the URL is relative, it should be relative to the canonical URL of the file.
    if (href !== undefined && isRelative(href)) {
      // https://github.com/denoland/deno_website2/issues/1047
      href = decodeURIComponent(relativeToAbsolute(displayURL, href));
    }

    const hrefURL = href ? new URL(href) : undefined;

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
