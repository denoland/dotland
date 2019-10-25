import React from "react";
import ReactDOM from "react-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/styles";
import { useMediaQuery } from "@material-ui/core";
import App from "./App";
import { generateTheme, useDarkMode } from "./theme";

ReactDOM.render(<Index />, document.getElementById("root"));

function Index() {
  const darkMode = useDarkMode();
  const theme = React.useMemo(() => generateTheme(darkMode), [darkMode]);

  return (
    <ThemeProvider theme={theme}>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
      <App />
    </ThemeProvider>
  );
}
