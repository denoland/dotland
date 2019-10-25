import React from "react";
import { main } from "./doc_utils";
import CodeBlock from "./CodeBlock";
import Markdown from "./Markdown";
import { useLocation } from "react-router-dom";
import {
  Link,
  List,
  ListItem,
  Box,
  Button,
  Divider,
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
              <ListItem key={d.name}>
                <a href={`?doc#${d.name}`}>{d.name}</a>
              </ListItem>
            );
          })}
        </List>
      </nav>
      {docs.map(d => {
        const href = "?doc#" + d.name;
        const title = (
          <Link href={href} color="inherit">
            <code>{d.name}</code>
          </Link>
        );
        const subheader = <code>{d.typestr}</code>;
        let frag = location.hash.substr(1);
        const raised = frag === d.name;
        return (
          <Box key={d.name} my={3} id={d.name}>
            <Card raised={raised}>
              <CardHeader title={title} subheader={subheader} />
              <CardContent>
                <Markdown source={d.docstr} />
                <Divider />
                <CodeBlock language="json" value={JSON.stringify(d, null, 1)} />
              </CardContent>
            </Card>
          </Box>
        );
      })}
    </div>
  );
}
