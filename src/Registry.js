import React from "react";
import { Box } from "@material-ui/core";

function matchParamsToRemoteUrl({
  stdPath,
  stdVersion,
  mod,
  modVersion,
  modPath
}) {
  return "todo";
}

function Registry({ match }) {
  const rUrl = matchParamsToRemoteUrl(match.params);

  return (
    <Box>
      <p>deno mod {JSON.stringify(match)}</p>
      <p>remote url {rUrl}</p>
    </Box>
  );
}

export default Registry;
