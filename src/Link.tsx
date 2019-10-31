import React from "react";
import { HashLink, HashLinkProps } from "react-router-hash-link";
import { Link as MaterialLink } from "@material-ui/core";
import { LinkProps } from "@material-ui/core/Link/Link";

export const InternalLink = React.forwardRef((props: HashLinkProps, ref) => (
  <HashLink {...props} />
));

interface Props {
  /** Supports both internal and external links */
  to: string;
}

/** Use this component instead of MaterialUI's Link or ReactRouter's Link. */
export const Link: React.FC<Props & LinkProps> = props => {
  if (props.to.indexOf("://") === -1) {
    return <MaterialLink component={InternalLink} {...props} />;
  } else {
    return <MaterialLink {...props} component="a" href={props.to} />;
  }
};
