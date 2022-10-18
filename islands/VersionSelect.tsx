// Copyright 2022 the Deno authors. All rights reserved. MIT license.

import { IS_BROWSER } from "$fresh/runtime.ts";
import { tw } from "@twind";

export default function VersionSelect({ versions, selectedVersion }: {
  versions: Record<string, string>;
  selectedVersion: string;
}) {
  const latestVersion = Object.keys(versions)[0];
  const selectedIsLatest = selectedVersion === latestVersion;
  return (
    <>
      <div class={tw`relative`}>
        <label htmlFor="version" class={tw`sr-only`}>
          Version
        </label>
        {selectedIsLatest && (
          <div
            class={tw`flex absolute pointer-events-none select-none w-full h-full items-center justify-end pr-8`}
          >
            <div class={tw`tag-label bg-tag-blue-bg text-tag-blue`}>Latest</div>
          </div>
        )}
        <select
          id="version"
          class={tw`rounded-md block border border-border appearance-none bg-white form-select-bg font-semibold ${
            selectedIsLatest ? "pr-22" : "pr-10"
          } py-2 pl-3 w-full h-full leading-none sm:(text-sm leading-5) focus:(outline-none border-[#a4cafe]) hover:bg-light-border`}
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
          {Object.keys(versions).map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>

      {!selectedIsLatest && (
        <a
          class={tw`button-primary`}
          aria-label="Go to latest version"
          href={versions[latestVersion]}
        >
          Go to Latest
        </a>
      )}
    </>
  );
}
