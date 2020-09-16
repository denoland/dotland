/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import json from "../languages.json";

export const LANGUAGES: Language[] = json.sort((a, b) =>
  a.language < b.language ? -1 : 1
);

export interface Language {
  language: string;
  english: string;
  link: string;
  repository: string;
}
