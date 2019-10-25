import React from "react";
import { main } from "./doc_utils";
import CodeBlock from "./CodeBlock";
import { Link, useLocation } from "react-router-dom";
import {
  List,
  ListItem,
  Box,
  Button,
  Card,
  CardHeader,
  CardContent
} from "@material-ui/core";

interface Props {
  source: string;
}

export default function Docs(props: Props) {
  const location = useLocation();
  const docs = main(location.pathname, props.source);

  return (
    <div>
      <nav>
        <List>
          {docs.map(d => {
            return (
              <ListItem>
                <a href={`?doc#${d.name}`}>{d.name}</a>
              </ListItem>
            );
          })}
        </List>
      </nav>
      {docs.map(d => {
        return (
          <Box my={3} id={d.name}>
            <Card raised={true}>
              <CardHeader title={d.name} subheader={d.typestr} />
              <CardContent>
                <p>{d.docstr}</p>
                <CodeBlock language="json" value={JSON.stringify(d, null, 1)} />
              </CardContent>
            </Card>
          </Box>
        );
      })}
    </div>
  );
}
