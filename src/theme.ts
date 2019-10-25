import { red, blue, cyan } from "@material-ui/core/colors";
import { createMuiTheme } from "@material-ui/core/styles";

// A custom theme for this app
const generateTheme = (darkMode: boolean) =>
  createMuiTheme({
    palette: {
      type: darkMode ? "dark" : "light",
      primary: blue,
      secondary: cyan,
      error: {
        main: red.A400
      },
      background: {
        default: darkMode ? "#000" : "#fff"
      }
    }
  });

export default generateTheme;
