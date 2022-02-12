/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

/** @jsx h */
import { gfm, h } from "../deps.ts";
import { RawCodeBlock } from "./CodeBlock.tsx";
import { replaceEmojis } from "../util/emoji_util.ts";
import {
  markup,
  MarkupProps,
  slugify,
  transformImageUri,
  transformLinkUri,
} from "./Markup.tsx";

export function Markdown(props: MarkupProps) {
  if (!props.source) {
    return null;
  }

  console.log(props);

  //const html = gfm(file.body, { allowIframes: true });
  return <div></div>;
}
