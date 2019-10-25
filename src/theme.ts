import { red, blue, cyan } from "@material-ui/core/colors";
import { createMuiTheme } from "@material-ui/core/styles";
import { useMediaQuery } from "@material-ui/core";

export const useDarkMode = () => useMediaQuery("(prefers-color-scheme: dark)");

export const generateTheme = (darkMode: boolean) =>
  createMuiTheme({
    palette: {
      type: darkMode ? "dark" : "light",
      primary: blue,
      secondary: cyan,
      error: red
    }
  });
