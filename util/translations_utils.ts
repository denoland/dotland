/* Copyright 2022 the Deno authors. All rights reserved. MIT license. */

import json from "../translations.json" assert { type: "json" };

export const TRANSLATIONS: Translation[] = json.sort((a, b) =>
  a.language < b.language ? -1 : 1
);

export interface Translation {
  language: string;
  english: string;
  link: string;
  repository: string;
}
