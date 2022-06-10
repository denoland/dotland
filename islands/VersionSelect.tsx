/** @jsx h */
import { h, IS_BROWSER } from "$fresh/runtime.ts";
import { tw } from "twind";

export default function VersionSelect({ versions, selectedVersion }: {
  versions: Record<string, string>;
  selectedVersion: string;
}) {
  return (
    <div class={tw`max-w-xs rounded-md shadow-sm w-full`}>
      <select
        class={tw
          `block form-select w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5`}
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
  );
}
