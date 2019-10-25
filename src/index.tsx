import React from "react";
import ReactDOM from "react-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/styles";
import { useMediaQuery } from "@material-ui/core";
import App from "./App";
import generateTheme from "./theme";

ReactDOM.render(<Index />, document.getElementById("root"));

function Index() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = React.useMemo(() => generateTheme(prefersDarkMode), [
    prefersDarkMode
  ]);

  return (
    <ThemeProvider theme={theme}>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
      <App />
    </ThemeProvider>
  );
}
