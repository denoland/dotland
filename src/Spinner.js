import React from "react";
import { Grid, CircularProgress } from "@material-ui/core";

export default function Spinner() {
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justify="center"
    >
      <Grid item xs={3}>
        <CircularProgress />
      </Grid>
    </Grid>
  );
}
