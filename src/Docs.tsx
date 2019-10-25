import React, { useState } from "react";
import { main } from "./doc_utils";
import CodeBlock from "./CodeBlock";
import { Link, useLocation } from "react-router-dom";
import {
  ListItem,
  Box,
  Card,
  CardHeader,
  CardContent,
  Drawer,
  Button,
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
              <ListItem key={i}>
                <a href={`?doc#${d.name}`}>{d.name}</a>
              </ListItem>
            );
          })}
        </Drawer>
      </nav>
      <main>
        {<Button onClick={() => setDrawerOpen(!drawerOpen)}>{drawerOpen ? "Hide Menu" : "Open Menu"}</Button>}
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
      </main>
    </div>
  );
}
