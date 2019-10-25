import React from "react";
import { main } from "./doc_utils";
import { useLocation } from "react-router-dom";

interface Props {
  source: string;
}

export default function Docs(props: Props) {
  const location = useLocation();
  const result = main(location.pathname, props.source);

  return <pre>{JSON.stringify(result, null, 2)}</pre>;
}
