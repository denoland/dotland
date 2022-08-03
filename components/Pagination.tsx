// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
/** @jsxFrag Fragment */
import { ComponentProps, Fragment, h } from "preact";
import { tw } from "@twind";
import { ModulesList } from "@/util/registry_utils.ts";
import * as Icons from "./Icons.tsx";

export function getPageCount({
  totalCount,
  perPage,
}: {
  totalCount: number;
  perPage: number;
}): number {
  return Math.ceil(totalCount / perPage);
}

export function getHasNext({
  totalCount,
  perPage,
  page,
}: {
  totalCount: number;
  perPage: number;
  page: number;
}): boolean {
  return page < getPageCount({ totalCount, perPage });
}

export function Pagination({ query, currentPage, perPage, data }: {
  query?: string;
  data: ModulesList;
  currentPage: number;
  perPage: number;
}) {
  const pageCount = getPageCount({
    totalCount: data.totalCount,
    perPage,
  });
  const hasNext = getHasNext({
    page: currentPage,
    totalCount: data.totalCount,
    perPage,
  });

  function toPage(n: number): string {
    const params = new URLSearchParams();
    if (query) {
      params.set("query", query);
    }
    params.set("page", n.toString());
    return "/x?" + params.toString();
  }

  if (!query) {
    return (
      <>
        <div
          class={tw`p-3.5 rounded-lg border border-dark-border px-2.5 py-1.5 flex items-center gap-2.5 bg-white`}
        >
          <MaybeA disabled={!(currentPage > 1)} href={toPage(currentPage - 1)}>
            <Icons.ArrowLeft />
          </MaybeA>
          <div class={tw`leading-none`}>
            Page <span class={tw`font-medium`}>{currentPage}</span> of{" "}
            <span class={tw`font-medium`}>{pageCount}</span>
          </div>
          <MaybeA disabled={!hasNext} href={toPage(currentPage + 1)}>
            <Icons.ArrowRight />
          </MaybeA>
        </div>

        <div class={tw`text-sm text-[#6C6E78]`}>
          Showing{" "}
          <span class={tw`font-medium`}>
            {(currentPage - 1) * perPage + 1}
          </span>{" "}
          to{" "}
          <span class={tw`font-medium`}>
            {(currentPage - 1) * perPage + data.results.length}
          </span>{" "}
          of{" "}
          <span class={tw`font-medium`}>
            {data.totalCount}
          </span>
        </div>
      </>
    );
  } else {
    return (
      <div class="flex flex-1 justify-center">
        <MaybeA
          disabled={false}
          href={toPage(currentPage + 1)}
          class={tw`px-3.5 py-2 border border-dark-border bg-white rounded-md`}
        >
          Next
        </MaybeA>
      </div>
    );
  }
}

function MaybeA(
  props:
    | ({ disabled: true } & ComponentProps<"div">)
    | ({ disabled: false } & ComponentProps<"a">),
) {
  if (props.disabled) {
    return <div {...props} class={tw`text-[#D2D2DC] cursor-not-allowed`} />;
  } else {
    return <a {...props} class={tw`hover:text-light`} />;
  }
}
