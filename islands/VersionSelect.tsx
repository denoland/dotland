// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
import { h } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { tw } from "@twind";
import { Tag } from "@/components/Tag.tsx";

export default function VersionSelect({ versions, selectedVersion }: {
  versions: Record<string, string>;
  selectedVersion: string;
}) {
  const selectedIsLatest = selectedVersion === Object.keys(versions)[0];
  return (
    <div class={tw`h-10 relative`}>
      <label htmlFor="version" class={tw`sr-only`}>
        Version
      </label>
      {selectedIsLatest && (
        <div
          class={tw
            `inline flex absolute pointer-events-none w-full h-full items-center justify-end pr-8`}
        >
          <Tag color="blue">Latest</Tag>
        </div>
      )}
      <select
        id="version"
        class={tw
          `rounded-md block border-dark-border form-select leading-none font-semibold ${
            selectedIsLatest ? "pr-22" : ""
          } bg-transparent w-full h-full sm:text-sm sm:leading-5`}
        value={selectedVersion}
        onChange={(e) => {
          if (e.currentTarget.value !== selectedVersion) {
            location.href = versions[e.currentTarget.value];
          }
        }}
        disabled={!IS_BROWSER}
      >
        {!Object.hasOwn(versions, selectedVersion) && (
          <option key={selectedVersion} value={selectedVersion}>
            {selectedVersion}
          </option>
        )}
        {Object.keys(versions).map((tag, index) => (
          <option key={tag} value={tag}>
            {tag}
          </option>
        ))}
      </select>
    </div>
  );
}
