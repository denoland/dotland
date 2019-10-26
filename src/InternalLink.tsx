import React from "react";
import { HashLink, HashLinkProps } from "react-router-hash-link";

export const InternalLink = React.forwardRef((props: HashLinkProps, ref) => (
  <HashLink {...props} />
));
