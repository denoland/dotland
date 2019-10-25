import React from "react";
import { main } from "./doc_utils";
import { useLocation } from "react-router-dom";
import { Box, Card, CardHeader, CardContent } from "@material-ui/core";

interface Props {
  source: string;
}

export default function Docs(props: Props) {
  const location = useLocation();
  const docs = main(location.pathname, props.source);

  return (
    <div>
      {docs.map(docEntry => {
        console.log("docEntry", docEntry);
        return (
          <Box m={2}>
            <Card>
              <CardHeader title={docEntry.name} />
              <CardContent>
                <pre>{docEntry.typestr}</pre>
                <p>{docEntry.docstr}</p>
              </CardContent>
            </Card>
          </Box>
        );
      })}
    </div>
  );

  //return <pre>{JSON.stringify(result, null, 2)}</pre>;
}
