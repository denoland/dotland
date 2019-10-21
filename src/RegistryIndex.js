import React from "react";
import { DATABASE, getEntry } from "./registry_utils";

export default function RegistryIndex(params) {
  return (
    <main>
      <a href="/">
        <img alt="deno logo" src="/images/deno_logo_4.gif" width="200" />
      </a>
      <h1>Deno Modules</h1>

      <p>This is a code hosting service for Deno scripts.</p>

      <p>
        The basic format of code URLs is{" "}
        <code>https://deno.land/x/MODULE_NAME@BRANCH/SCRIPT.ts</code>. If you
        leave out the branch, it will default to master.
      </p>

      <p>
        Functionality built-in to Deno is not listed here. The built-in runtime
        is documented at{" "}
        <a href="https://deno.land/typedoc/">deno.land/typedoc</a> and in{" "}
        <a href="https://deno.land/manual.html">the manual</a>.
      </p>

      <h2>Standard</h2>

      <p>
        <a href="https://deno.land/std/README.md">deno.land/std</a>
      </p>
      <ul>
        <li>maintained by the Deno authors,</li>
        <li>have no external dependencies,</li>
        <li>are MIT or Apache licensed, and</li>
        <li>
          conform to{" "}
          <a href="https://deno.land/style_guide.html">the style guide</a>.
        </li>
      </ul>

      <h2 id="modules">Third Party</h2>

      <p>
        To add to this list, edit{" "}
        <a href="https://github.com/denoland/registry/blob/master/src/database.json">
          database.json
        </a>
        .
      </p>

      <p>{Object.entries(DATABASE).length} third party modules:</p>

      <ul class="modules">
        {Object.keys(DATABASE)
          .sort((nameA, nameB) => nameA.localeCompare(nameB))
          .map(name => {
            const entry = getEntry(name);
            const link = `./${name}/`;
            return (
              <li>
                <a href={link}>{name}</a> (<a href={entry.repo}>repo</a>)
              </li>
            );
          })}
      </ul>
    </main>
  );
}
