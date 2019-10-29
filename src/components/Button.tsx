import React from "react";
import { HashLink, HashLinkProps } from "react-router-hash-link";
import { Button as MaterialButton } from "@material-ui/core";

const InternalLink = React.forwardRef((props: HashLinkProps, ref) => (
  <HashLink {...props} />
));

export const Button = props => {
  if (!props.to) {
    return <MaterialButton {...props} component="button" />;
  } else if (props.to.indexOf("://") === -1) {
    return <MaterialButton component={InternalLink} {...props} />;
  } else {
    return <MaterialButton {...props} component="a" href={props.to} />;
  }
};
