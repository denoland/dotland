import React from "react";
import { HashLink, HashLinkProps } from "react-router-hash-link";
import { Link as MaterialLink } from "@material-ui/core";
import { LinkProps } from "@material-ui/core/Link/Link";

export const InternalLink = React.forwardRef((props: HashLinkProps, ref) => (
  <HashLink {...props} />
));

/** isInternalLink checks if link is internal or external */
export function isInternalLink(link: string): Boolean {
  if (link.indexOf("://") === -1) return true;
  return false;
}

interface Props {
  /** Supports internal and external links */
  to: string;
}

/** Use this component instead of MaterialUI's Link or ReactRouter's Link. */
export const Link: React.FC<Props & Omit<LinkProps, "href">> = props => {
  if (isInternalLink(props.to)) {
    return <MaterialLink component={InternalLink} {...props} />;
  } else {
    return <MaterialLink {...props} component="a" href={props.to} />;
  }
};
