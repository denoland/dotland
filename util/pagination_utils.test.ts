/* eslint-env jest */

/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import { hasPrevious, hasNext, pageCount } from "./pagination_utils";

test("hasPrevious", () => {
  expect(hasPrevious({ page: 0 })).toEqual(false);
  expect(hasPrevious({ page: 1 })).toEqual(false);
  expect(hasPrevious({ page: 2 })).toEqual(true);
  expect(hasPrevious({ page: 5 })).toEqual(true);
});

test("hasNext", () => {
  expect(hasNext({ page: 1, totalCount: 30, perPage: 5 })).toEqual(true);
  expect(hasNext({ page: 5, totalCount: 30, perPage: 5 })).toEqual(true);
  expect(hasNext({ page: 6, totalCount: 30, perPage: 5 })).toEqual(false);
  expect(hasNext({ page: 1, totalCount: 29, perPage: 5 })).toEqual(true);
  expect(hasNext({ page: 5, totalCount: 29, perPage: 5 })).toEqual(true);
  expect(hasNext({ page: 6, totalCount: 29, perPage: 5 })).toEqual(false);
  expect(hasNext({ page: 1, totalCount: 31, perPage: 5 })).toEqual(true);
  expect(hasNext({ page: 5, totalCount: 31, perPage: 5 })).toEqual(true);
  expect(hasNext({ page: 6, totalCount: 31, perPage: 5 })).toEqual(true);
  expect(hasNext({ page: 7, totalCount: 31, perPage: 5 })).toEqual(false);
});

test("pageCount", () => {
  expect(pageCount({ totalCount: 30, perPage: 5 })).toEqual(6);
  expect(pageCount({ totalCount: 31, perPage: 5 })).toEqual(7);
});
