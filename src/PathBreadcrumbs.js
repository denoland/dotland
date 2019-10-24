import React from "react";
import { Box, Breadcrumbs } from "@material-ui/core";
import { Link, useLocation } from "react-router-dom";
import assert from "assert";

export default function PathBreadcrumbs() {
  const location = useLocation();

  // Don't show breadcrumbs on root page.
  if (location.pathname === "/") {
    return null;
  }

  const parts = location.pathname.split("/");

  return (
    <Box my={3}>
      <Breadcrumbs separator="/">
        {parts.map((part, i) => {
          console.log({ part, i });
          if (i === 0) {
            assert(!part);
            return (
              <Link to="/" key={i}>
                deno.land
              </Link>
            );
          }

          const last = i === parts.length - 1;
          if (last || !parts[i + 1]) {
            return <span key={i}>{part}</span>;
          }

          let url = parts.slice(0, i + 1).join("/");

          // Always add a trailing slash to dir URLs.
          if (!last && !url.endsWith("/")) {
            url += "/";
          }
          console.log({ parts, url });
          return (
            <Link to={url} key={i}>
              {part}
            </Link>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
}
