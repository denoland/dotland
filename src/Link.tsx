import React from "react";
import { HashLink, HashLinkProps } from "react-router-hash-link";
import { Link as MaterialLink } from "@material-ui/core";

const InternalLink = React.forwardRef((props: HashLinkProps, ref) => (
  <HashLink {...props} />
));

export const Link = (props) => {
  if (props.to.indexOf("://")=== -1) {
    return <MaterialLink component={InternalLink} {...props}/>
  } else {
    return <MaterialLink {...props} component="a" href={props.to} />
  }
}