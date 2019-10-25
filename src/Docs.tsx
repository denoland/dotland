import React, { useState } from "react";
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
  CardContent,
  Drawer,
} from "@material-ui/core";
import "./Docs.scss";

interface Props {
  source: string;
}

export default function Docs(props: Props) {
  const location = useLocation();
  const docs = main(location.pathname, props.source);
  const [drawerOpen, setDrawerOpen] = useState(true);

  return (
    <div className="docs">
      <nav className="sidebar">
        <Drawer
          variant="persistent"
          anchor={'left'}
          open={drawerOpen}
          onClose={setDrawerOpen.bind(null, false)}
        >
          <div className="header">
            <Button onClick={setDrawerOpen.bind(null, false)}>Close</Button>
            <h2>Menu</h2>
          </div>
          {docs.map((d, i) => {
            return (
              <ListItem key={d.name}>
                <a href={`?doc#${d.name}`}>{d.name}</a>
              </ListItem>
            );
          })}
        </Drawer>
      </nav>
      <main>
        {<Button onClick={() => setDrawerOpen(!drawerOpen)}>{drawerOpen ? "Hide Menu" : "Show Menu"}</Button>}
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
      </main>
    </div>
  );
}
