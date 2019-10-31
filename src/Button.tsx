import React from "react";
import { InternalLink } from "./Link";
import { Button as MaterialButton } from "@material-ui/core";
import { ButtonProps } from "@material-ui/core/Button/Button";

interface Props {
  /** Supports both internal and external links */
  to?: string;
  component?: HTMLElement;
}

/** Use this component instead of MaterialUI's Button or ReactRouter's Link */
export const Button: React.FC<Props & ButtonProps> = props => {
  let { to, ...rest } = props;
  if (!props.to) {
    return <MaterialButton {...props} />;
  } else if (props.to.indexOf("://") === -1) {
    return <MaterialButton component={InternalLink} {...props} />;
  } else {
    return <MaterialButton {...rest} href={to} />;
  }
};
