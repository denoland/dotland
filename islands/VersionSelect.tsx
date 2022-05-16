/** @jsx h */
import { h } from "../deps.ts";

export default function VersionSelect({ versions, selectedVersion }: {
  versions: Record<string, string>;
  selectedVersion: string;
}) {
  return (
    <div className="max-w-xs rounded-md shadow-sm w-full">
      <select
        id="version"
        className="block form-select w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
        value={selectedVersion}
        onChange={(e) => {
          if (e.target!.value !== selectedVersion) {
            location.href = versions[e.target!.value];
          }
        }}
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
