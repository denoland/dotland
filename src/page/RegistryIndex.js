import React from "react";
import Link from "../component/Link";
import DATABASE from "../database.json";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";

export default function RegistryIndex() {
  return (
    <main>
      <Link href="/">
        <img
          alt="deno logo"
          src="/images/deno-circle-thunder.gif"
          width="200"
        />
      </Link>
      <h1>Third Party Modules</h1>

      <p>This is a code hosting service for Deno scripts.</p>

      <p>
        The basic format of code URLs is{" "}
        <code>https://deno.land/x/MODULE_NAME@BRANCH/SCRIPT.ts</code>. If you
        leave out the branch, it will default to master.
      </p>

      <p>
        Functionality built-in to Deno is not listed here. The built-in runtime
        is documented at <Link href="/typedoc/">deno.land/typedoc</Link> and in{" "}
        <Link href="/manual">the manual</Link>.
      </p>

      <p>
        See <Link href="/std/README.md">/std</Link> for the standard modules.
      </p>

      <p>
        To add to this list, edit{" "}
        <Link href="https://github.com/denoland/deno_website2/blob/master/src/database.json">
          database.json
        </Link>
        .
      </p>

      <p>{Object.entries(DATABASE).length} third party modules:</p>
      <List dense>
        {Object.keys(DATABASE)
          .sort((nameA, nameB) => nameA.localeCompare(nameB))
          .map((name, i) => {
            const link = `/x/${name}/`;
            return (
              <React.Fragment key={i}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={<Link href={link}>{name}</Link>}
                    secondary={
                      <React.Fragment>{DATABASE[name].desc}</React.Fragment>
                    }
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            );
          })}
      </List>
    </main>
  );
}
