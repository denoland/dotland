import React from "react";
import SyntaxHighlighter, {
  SyntaxHighlighterProps
} from "react-syntax-highlighter";
import lightTheme from "react-syntax-highlighter/dist/cjs/styles/hljs/atom-one-light";
import darkTheme from "react-syntax-highlighter/dist/cjs/styles/hljs/atom-one-dark";
import { useDarkMode } from "../hook/theme";
import FileCopyIcon from '@material-ui/icons/FileCopy';
import CheckIcon from '@material-ui/icons/Check';
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
    position: 'relative',
    right: '5px',
    float: 'right'
  },
  hidden: {
    display: 'none'
  },
  container: {
    position: 'relative',
    paddingLeft: '0',
    paddingRight: '0'
  },
  checkIcon: {
    color: 'rgb(80, 161, 79)'
  }
}));

function CodeBlock(props: SyntaxHighlighterProps) {
  const darkMode = useDarkMode();
  const classes = useStyles(darkMode);

  const [showCopyState, setShowCopy] = React.useState({
    showCopy: false,
  });
  
  const [copiedState, setCopied] = React.useState({
    copied: false,
  });

  function onContainerEnter() {
    setShowCopy({showCopy: true});
  }

  function onContainerLeave() {
    setShowCopy({showCopy: false});
  }

  function onCopy() {
    setCopied({copied: true});
    setTimeout(() => {
      setCopied({copied: false});
    }, 1300)
  }

  return (
    <Container
      onMouseEnter={onContainerEnter}
      onMouseLeave={onContainerLeave}
      className={classes.container}>
      <Zoom in={showCopyState.showCopy || copiedState.copied} style={{ transitionDelay: '50ms' }}>
        <CopyToClipboard
          text={props.value}
          onCopy={onCopy}>
          <IconButton
            aria-label="copy"
            size="small"
            className={`${classes.copyButton}`}>
            {copiedState.copied ?
              <CheckIcon fontSize="inherit" className={classes.checkIcon} /> :
              <FileCopyIcon fontSize="inherit" /> }
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
    </Container >
  );
}

export default CodeBlock;
