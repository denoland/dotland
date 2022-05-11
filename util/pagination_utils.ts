// Copyright 2022 the Deno authors. All rights reserved. MIT license.

export interface PaginationProps {
  pageCount: number;
  currentPage: number;
  perPage: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export function hasPrevious({ page }: { page: number }): boolean {
  return page > 1;
}

export function hasNext({
  totalCount,
  perPage,
  page,
}: {
  totalCount: number;
  perPage: number;
  page: number;
}): boolean {
  return page < pageCount({ totalCount, perPage });
}

export function pageCount({
  totalCount,
  perPage,
}: {
  totalCount: number;
  perPage: number;
}): number {
  return Math.ceil(totalCount / perPage);
}
