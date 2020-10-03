/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import emojis from "./emojis.json";

export function replaceEmojis(src: string): string {
  const candidates = src.matchAll(/:([a-z0-9_]+):/g);
  for (const candidate of candidates) {
    const emoji = candidate[1];
    if ((emojis as any)[emoji]) {
      src = src.replace(`:${emoji}:`, (emojis as any)[emoji]);
    }
  }
  return src;
}
