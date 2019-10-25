import React from "react";
import { main } from "./doc_utils";
import CodeBlock from "./CodeBlock";
import { Link, useLocation } from "react-router-dom";
import {
  List,
  ListItem,
  Drawer,
  Box,
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
      <Drawer open={true} variant="persistent">
        <List>
          {docs.map(d => {
            return (
              <ListItem>
                <a href={"?doc#" + d.name}>{d.name}</a>
              </ListItem>
            );
          })}
        </List>
      </Drawer>
      <p>
        <a href="?">Code</a>
      </p>
      {docs.map(d => {
        return (
          <div id={"#" + d.name}>
            <Card>
              <CardHeader title={d.name} subheader={d.typestr} />
              <CardContent>
                <p>{d.docstr}</p>
                <CodeBlock language="json" value={JSON.stringify(d, null, 1)} />
              </CardContent>
            </Card>
          </div>
        );
      })}
    </div>
  );
}
