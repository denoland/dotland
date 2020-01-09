import React from "react";
import SyntaxHighlighter, {
  SyntaxHighlighterProps
} from "react-syntax-highlighter";
import lightTheme from "react-syntax-highlighter/dist/cjs/styles/hljs/atom-one-light";
import darkTheme from "react-syntax-highlighter/dist/cjs/styles/hljs/atom-one-dark";
import { useDarkMode } from "../hook/theme";
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { IconButton, Container, Zoom } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import { CopyToClipboard } from 'react-copy-to-clipboard';

lightTheme["hljs-selection"] = {
  backgroundColor: "#ebebeb" // https://github.com/atom/one-light-ui/blob/master/styles/ui-variables.less#L32
};
darkTheme["hljs-selection"] = {
  backgroundColor: "#3a404b" // https://github.com/atom/one-dark-ui/blob/master/styles/ui-variables.less#L32
};

const useStyles = makeStyles(theme => ({
  copyButton: {
    float: 'left'
  },
  hidden: {
    display: 'none'
  },
  copied: {
    opacity: 0,
    transition: 'opacity 0.3s'
  }
}));


function CodeBlock(props: SyntaxHighlighterProps) {
  const darkMode = useDarkMode();
  const classes = useStyles(darkMode);

  function onContainerEnter() {
    let newState = Object.assign({}, state)
    newState.showCopy = true
    setState( newState );
  }

  function onContainerLeave() {
    let newState = Object.assign({}, state)
    newState.showCopy = false
    setState( newState );
  }

  function onCopy() {
    let newState = Object.assign({}, state)
    newState.copied = true
    setState( newState );
    setTimeout(() => {
      newState = Object.assign({}, state)
      newState.copied = false;
      setState(newState)
    }, 300)
  }

  const [state, setState] = React.useState({
    showCopy: false,
    copied: false,
  });

  return (
    <Container
      onMouseEnter={onContainerEnter}
      onMouseLeave={onContainerLeave}>
      <Zoom in={state.showCopy} style={{ transitionDelay: '50ms' }}>
        <CopyToClipboard
          text={props.value}
          onCopy={onCopy}>
          <IconButton
            aria-label="copy"
            size="small"
            className={`${classes.copyButton}`}>
            <FileCopyIcon fontSize="inherit" />
          </IconButton>
        </CopyToClipboard>
      </Zoom>
      <SyntaxHighlighter
        className={state.copied ? classes.copied : ''}
        style={darkMode ? darkTheme : lightTheme}
        language={props.language || "js"}
        showLineNumbers={props.showLineNumbers || false}
        wrapLines={true}
        lineProps={props.lineProps}
      >
        {props.value}
      </SyntaxHighlighter>
    </Container >
  );
}

export default CodeBlock;
