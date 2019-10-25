import React from "react";
import { main } from "./doc_utils";
import CodeBlock from "./CodeBlock";
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
              <CardHeader title={docEntry.name} subheader={docEntry.typestr} />
              <CardContent>
                <p>{docEntry.docstr}</p>
                <CodeBlock
                  language="json"
                  value={JSON.stringify(docEntry, null, 1)}
                />
              </CardContent>
            </Card>
          </Box>
        );
      })}
    </div>
  );
}
