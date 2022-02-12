/* Copyright 2022 the Deno authors. All rights reserved. MIT license. */

/** @jsx h */
import { h, useEffect } from "../deps.ts";

export function slugify(text: string): string {
  text = text.toLowerCase();
  text = text.split(" ").join("-");
  text = text.split(/\t/).join("--");
  text = text.split(/[|$&`~=\\/@+*!?({[\]})<>=.,;:'"^]/).join("");
  text = text
    .split(/[。？！，、；：“”【】（）〔〕［］﹃﹄“ ”‘’﹁﹂—…－～《》〈〉「」]/)
    .join("");

  return text;
}

export interface MarkupProps {
  source: string;
  displayURL: string;
  sourceURL: string;
  baseURL: string;
  className?: string;
}

export function markup(props: MarkupProps, raw: string) {
  return (
    <div
      dangerouslySetInnerHTML={{ __html: raw }}
      className={`markup py-8 px-4 ${props.className ?? ""}`}
      onClick={handleClick}
    />
  );
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
  const parts = baseURL.pathname.split("/");
  parts[parts.length - 1] = relative;
  return new URL(baseURL.origin + parts.join("/")).href;
}

export function transformLinkUri(displayURL: string, baseURL: string) {
  return (uri: string): string => {
    let href = uri;

    if (uri.startsWith("#")) return uri;
    if (uri.startsWith("mailto:")) return uri;

    // If the URL is relative, it should be relative to the canonical URL of the file.
    if (isRelative(href)) {
      // https://github.com/denoland/dotland/issues/1047
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

    return encodeURI(href);
  };
}

export function transformImageUri(sourceURL: string) {
  return (uri: string): string => {
    if (isRelative(uri)) {
      return relativeToAbsolute(sourceURL, uri);
    }
    return encodeURI(decodeURI(uri));
  };
}
