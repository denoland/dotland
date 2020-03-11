import React from "react";
import { useLocation } from "react-router-dom";

function NotFound() {
  const location = useLocation();
  return (
    <h1>
      Not Found. <code>{location.pathname}</code>
    </h1>
  );
}

export default NotFound;
