import React from "react";
import { Link as MaterialLink } from "@material-ui/core";
import { LinkProps } from "@material-ui/core/Link/Link";

interface Props extends LinkProps {
  /** Supports internal and external links */
  to: string;
}

/** Use this component instead of MaterialUI's Link or ReactRouter's Link. */
export default function Link(props: Props) {
  return <MaterialLink {...props} component="a" href={props.to} />;
}
