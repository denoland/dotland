import React from "react";
import { Breadcrumbs } from "@material-ui/core";
import { Link, useLocation } from "react-router-dom";

export default function PathBreadcrumbs() {
  const location = useLocation();
  const parts = location.pathname.split("/").slice(1);

  return (
    <Breadcrumbs separator="/">
      <span /> {/* Empty one so it starts with / */}
      {parts.map((part, i) => {
        const last = i === parts.length - 1;
        let url = "/" + parts.slice(0, i + 1).join("/");
        if (!last || location.pathname.endsWith("/")) {
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
  );
}
