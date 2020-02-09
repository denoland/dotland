import React from "react";
import { Link as MaterialLink } from "@material-ui/core";
import { LinkProps } from "@material-ui/core/Link/Link";
import { Link as RouterLink } from "react-router-dom";

interface Props extends Omit<LinkProps, "href"> {
  /** Supports internal and external links */
  to: string;
}

/** Use this component instead of MaterialUI's Link or ReactRouter's Link. */
export default function Link(props: Props) {
  const external = isExternal(props.to);

  return (
    <MaterialLink
      {...props}
      component={external ? "a" : RouterLink}
      href={props.to}
      to={props.to}
    />
  );
}

export function isExternal(url: string): boolean {
  return url.startsWith("http://") || url.startsWith("https://");
}
