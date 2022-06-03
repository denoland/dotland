// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
import { runtime, tw } from "../deps.ts";
import { type IndexStructure } from ".https://raw.githubusercontent.com/denoland/doc_components/59572f532b67ee61631a7921becc49c67433fa20/doc_components/doc.ts";
import { ModuleIndex } from "https://raw.githubusercontent.com/denoland/doc_components/59572f532b67ee61631a7921becc49c67433fa20/module_index.tsx";

export function DocView({ index }: { index: IndexStructure }) {
  return (
    <div className={tw`bg-white dark:(bg-gray-900 text-white)`}>
      <ModuleIndex>{index}</ModuleIndex>
    </div>
  );
}
