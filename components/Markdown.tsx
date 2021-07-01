/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import marked, { Renderer } from "marked";
import dompurify from "dompurify";
import { RawCodeBlock } from "./CodeBlock";
import { replaceEmojis } from "../util/emoji_util";
<<<<<<< HEAD

const REG_ID = /\{\s*#([-\w]+)\s*\}/;

function slugify(text: string): string {
  let matchs: RegExpMatchArray | null;
  if ((matchs = text.match(REG_ID)) !== null) {
    return matchs[1];
  }

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
  baseURL: string;
  className?: string;
}

function Markdown(props: MarkdownProps): React.ReactElement | null {
  useEffect(() => {
    const id = setTimeout(() => {
      let { hash } = location;
      hash = hash && hash.substring(1);
      if (!hash) return;

      const el = document.getElementsByName(hash)[0];
      if (!el) return;

      setTimeout(() => el.scrollIntoView(), 0);
    }, 50);
    return () => clearTimeout(id);
  }, []);
=======
import {
  markup,
  MarkupProps,
  scrollEffect,
  slugify,
  transformImageUri,
  transformLinkUri,
} from "./Markup";

function Markdown(props: MarkupProps): React.ReactElement | null {
  scrollEffect();
>>>>>>> a4c372917018bb93fc7e8b86ba09321adfcdb1d1

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
            ${text.replace(REG_ID, "")}
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

export default Markdown;
