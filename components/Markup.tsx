/* Copyright 2021 the Deno authors. All rights reserved. MIT license. */

import React from "react";

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
