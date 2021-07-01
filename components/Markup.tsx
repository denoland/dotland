/* Copyright 2021 the Deno authors. All rights reserved. MIT license. */

import React, { useEffect } from "react";

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

export function markup(props: MarkupProps, raw: string): React.ReactElement {
  return (
    <div
      dangerouslySetInnerHTML={{ __html: raw }}
      className={`markup py-8 px-4 ${props.className ?? ""}`}
      onClick={handleClick}
    />
  );
}

function handleClick(e: React.MouseEvent<HTMLElement>) {
  const el = e.target as HTMLElement;
  if (el.className !== "octicon-link") return;

  const anchor = el.parentNode as HTMLAnchorElement;
  navigator.clipboard.writeText(anchor.href);
}

export function scrollEffect() {
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

    return encodeURI(href);
  };
}

export function transformImageUri(sourceURL: string) {
  return (uri: string) => {
    if (isRelative(uri)) {
      return relativeToAbsolute(sourceURL, uri);
    }
    return encodeURI(uri);
  };
}
