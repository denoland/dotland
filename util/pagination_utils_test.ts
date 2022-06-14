// Copyright 2022 the Deno authors. All rights reserved. MIT license.

import { hasNext, hasPrevious, pageCount } from "./pagination_utils.ts";
import { assert, assertEquals } from "$std/testing/asserts.ts";

Deno.test("hasPrevious", () => {
  assert(!hasPrevious({ page: 0 }));
  assert(!hasPrevious({ page: 1 }));
  assert(hasPrevious({ page: 2 }));
  assert(hasPrevious({ page: 5 }));
});

Deno.test("hasNext", () => {
  assert(hasNext({ page: 1, totalCount: 30, perPage: 5 }));
  assert(hasNext({ page: 5, totalCount: 30, perPage: 5 }));
  assert(!hasNext({ page: 6, totalCount: 30, perPage: 5 }));
  assert(hasNext({ page: 1, totalCount: 29, perPage: 5 }));
  assert(hasNext({ page: 5, totalCount: 29, perPage: 5 }));
  assert(!hasNext({ page: 6, totalCount: 29, perPage: 5 }));
  assert(hasNext({ page: 1, totalCount: 31, perPage: 5 }));
  assert(hasNext({ page: 5, totalCount: 31, perPage: 5 }));
  assert(hasNext({ page: 6, totalCount: 31, perPage: 5 }));
  assert(!hasNext({ page: 7, totalCount: 31, perPage: 5 }));
});

Deno.test("pageCount", () => {
  assertEquals(pageCount({ totalCount: 30, perPage: 5 }), 6);
  assertEquals(pageCount({ totalCount: 31, perPage: 5 }), 7);
});
