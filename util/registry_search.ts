/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import algoliasearch from "algoliasearch/lite";
const ALGOLIA_CLIENT = algoliasearch(
  "R4L5ZOZ659",
  "2728353beb377fb5554cc23ee56079b3"
);
const MODULE_INDEX = ALGOLIA_CLIENT.initIndex("modules");

export interface SearchResult {
  name: string;
  description: string;
  owner: string;
  repo: string;
  starCount: string;
  createdAt: string;
}

export async function listModules(
  page: number,
  limit: number,
  query: string
): Promise<{
  results: SearchResult[];
  totalCount: number;
  processingTimeMs: number;
} | null> {
  const results = await MODULE_INDEX.search<SearchResult>(query, {
    hitsPerPage: limit,
    page: page - 1,
  });
  return {
    totalCount: results.nbHits,
    processingTimeMs: results.processingTimeMS,
    results: results.hits,
  };
}
