import React from "react";
import { InternalLink, isInternalLink } from "./Link";
import { Button as MaterialButton } from "@material-ui/core";
import { ButtonProps } from "@material-ui/core/Button/Button";

interface Props {
  /** Supports internal and external links */
  to?: string;
  component?: HTMLElement;
}

/** Use this component instead of MaterialUI's Button or ReactRouter's Link */
export const Button: React.FC<Props & Omit<ButtonProps, "href">> = props => {
  let { to, ...rest } = props;
  if (!to) {
    return <MaterialButton {...props} />;
  } else if (isInternalLink(to)) {
    return <MaterialButton component={InternalLink} {...props} />;
  } else {
    return <MaterialButton {...rest} href={to} />;
  }
};
