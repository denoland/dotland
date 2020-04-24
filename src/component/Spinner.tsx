import React from "react";
import { CircularProgress, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(_theme => ({
  spinner: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)"
  }
}));

export default function Spinner() {
  const classes = useStyles();

  return (
    <div className={classes.spinner}>
      <CircularProgress />
    </div>
  );
}
