import React from "react";
import { getEntry } from "./registry_utils";
import DATABASE from "./database.json";

export default function RegistryIndex() {
  return (
    <main>
      <a href="/">
        <img alt="deno logo" src="/images/deno_logo_4.gif" width="200" />
      </a>
      <h1>Third Party Modules</h1>

      <p>This is a code hosting service for Deno scripts.</p>

      <p>
        The basic format of code URLs is{" "}
        <code>https://deno.land/x/MODULE_NAME@BRANCH/SCRIPT.ts</code>. If you
        leave out the branch, it will default to master.
      </p>

      <p>
        Functionality built-in to Deno is not listed here. The built-in runtime
        is documented at <a href="/typedoc/">deno.land/typedoc</a> and in{" "}
        <a href="/manual">the manual</a>.
      </p>

      <p>
        See <a href="/std/README.md">/std</a> for the standard modules.
      </p>

      <p>
        To add to this list, edit{" "}
        <a href="https://github.com/denoland/registry/blob/master/src/database.json">
          database.json
        </a>
        .
      </p>

      <p>{Object.entries(DATABASE).length} third party modules:</p>

      <ul>
        {Object.keys(DATABASE)
          .sort((nameA, nameB) => nameA.localeCompare(nameB))
          .map((name, i) => {
            const entry = getEntry(name);
            const link = `/x/${name}/`;
            return (
              <li key={i}>
                <a href={link}>{name}</a> (<a href={entry.repo}>repo</a>)
              </li>
            );
          })}
      </ul>
    </main>
  );
}
