import React from "react";
import {
  Light as SyntaxHighlighter,
  SyntaxHighlighterProps
} from "react-syntax-highlighter";
import lightTheme from "react-syntax-highlighter/dist/cjs/styles/hljs/atom-one-light";
import darkTheme from "react-syntax-highlighter/dist/cjs/styles/hljs/atom-one-dark";
import javascript from "react-syntax-highlighter/dist/cjs/languages/hljs/javascript";
import typescript from "react-syntax-highlighter/dist/cjs/languages/hljs/typescript";
import json from "react-syntax-highlighter/dist/cjs/languages/hljs/json";
import markdown from "react-syntax-highlighter/dist/cjs/languages/hljs/markdown";
import shell from "react-syntax-highlighter/dist/cjs/languages/hljs/shell";
import { useDarkMode } from "../hook/theme";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import CheckIcon from "@material-ui/icons/Check";
import { IconButton, Container, Zoom } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { CopyToClipboard } from "react-copy-to-clipboard";

lightTheme["hljs-selection"] = {
  backgroundColor: "#ebebeb" // https://github.com/atom/one-light-ui/blob/master/styles/ui-variables.less#L32
};
darkTheme["hljs-selection"] = {
  backgroundColor: "#3a404b" // https://github.com/atom/one-dark-ui/blob/master/styles/ui-variables.less#L32
};

const useStyles = makeStyles(_theme => ({
  copyButton: {
    position: "absolute",
    right: "2px",
    top: "2px"
  },
  hidden: {
    display: "none"
  },
  container: {
    position: "relative",
    paddingLeft: "0",
    paddingRight: "0"
  },
  checkIcon: {
    color: "rgb(80, 161, 79)"
  }
}));
SyntaxHighlighter.registerLanguage("javascript", javascript);
SyntaxHighlighter.registerLanguage("typescript", typescript);
SyntaxHighlighter.registerLanguage("json", json);
SyntaxHighlighter.registerLanguage("markdown", markdown);
SyntaxHighlighter.registerLanguage("shell", shell);

function CodeBlock(props: SyntaxHighlighterProps) {
  const darkMode = useDarkMode();
  const classes = useStyles(darkMode);

  const [timer, setTimer] = React.useState(0);
  const [showCopy, setShowCopy] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  function onContainerEnter() {
    clearTimeout(timer);
    setShowCopy(true);
  }

  function onContainerLeave() {
    clearTimeout(timer);
    const timerId = setTimeout(() => {
      setShowCopy(false);
    }, 500);
    setTimer(timerId);
  }

  function onCopy() {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1300);
  }

  return (
    <Container
      onMouseEnter={onContainerEnter}
      onMouseLeave={onContainerLeave}
      className={classes.container}
    >
      <Zoom in={showCopy || copied} style={{ transitionDelay: "50ms" }}>
        <CopyToClipboard text={props.value} onCopy={onCopy}>
          <IconButton
            aria-label="copy"
            size="small"
            className={classes.copyButton}
          >
            {copied ? (
              <CheckIcon fontSize="inherit" className={classes.checkIcon} />
            ) : (
              <FileCopyIcon fontSize="inherit" />
            )}
          </IconButton>
        </CopyToClipboard>
      </Zoom>
      <SyntaxHighlighter
        style={darkMode ? darkTheme : lightTheme}
        language={props.language || "js"}
        showLineNumbers={props.showLineNumbers || false}
        wrapLines={true}
        lineProps={props.lineProps}
      >
        {props.value}
      </SyntaxHighlighter>
    </Container>
  );
}

export default CodeBlock;
