// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx runtime.h */
import { runtime } from "../../doc_components/services.ts";
import { tw } from "../deps.ts";
import { type IndexStructure } from "../../doc_components/doc.ts";
import { ModuleIndex } from "../../doc_components/module_index.tsx";

export function DocView({ index }: { index: IndexStructure; }) {
  return (
    <div className={tw`bg-white dark:(bg-gray-900 text-white)`}>
      <ModuleIndex>{index}</ModuleIndex>
    </div>
  );
}
