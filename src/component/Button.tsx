import React from "react";
import { Button as MaterialButton } from "@material-ui/core";
import { ButtonProps } from "@material-ui/core/Button/Button";
import { Link as RouterLink } from "react-router-dom";
import { isExternal } from "./Link";

interface Props extends Omit<ButtonProps, "href"> {
  to: string;
}

/** Use this component instead of MaterialUI's Button. */
export default function Button(props: Props) {
  const external = isExternal(props.to);

  return (
    <MaterialButton
      {...props}
      component={external ? "button" : RouterLink}
      href={props.to}
      to={props.to}
    />
  );
}
