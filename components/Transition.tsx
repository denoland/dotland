// From https://gist.githubusercontent.com/stevecastaneda/e71a8465c3f290b98982e5d160260de2/raw/68a48d6b5e0ef60ec5894a0cf6b171bb48681f23/Transition.tsx
// JSX Version by Adam Wathan: https://gist.github.com/adamwathan/e0a791aa0419098a7ece70028b2e641e
/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import React, { ReactNode } from "react";
import { CSSTransition as ReactCSSTransition } from "react-transition-group";
import { useContext, useEffect, useRef } from "react";

interface TransitionProps {
  show?: boolean;
  enter?: string;
  enterFrom?: string;
  enterTo?: string;
  leave?: string;
  leaveFrom?: string;
  leaveTo?: string;
  appear?: string | boolean;
  children: ReactNode;
}

interface ParentContextProps {
  parent: {
    show?: boolean;
    appear?: string | boolean;
    isInitialRender?: boolean;
  };
}

const TransitionContext = React.createContext<ParentContextProps>({
  parent: {},
});

function useIsInitialRender() {
  const isInitialRender = useRef(true);
  useEffect(() => {
    isInitialRender.current = false;
  }, []);
  return isInitialRender.current;
}

function CSSTransition({
  show,
  enter = "",
  enterFrom = "",
  enterTo = "",
  leave = "",
  leaveFrom = "",
  leaveTo = "",
  appear,
  children,
}: TransitionProps) {
  const enterClasses = enter.split(" ").filter((s) => s.length);
  const enterFromClasses = enterFrom.split(" ").filter((s) => s.length);
  const enterToClasses = enterTo.split(" ").filter((s) => s.length);
  const leaveClasses = leave.split(" ").filter((s) => s.length);
  const leaveFromClasses = leaveFrom.split(" ").filter((s) => s.length);
  const leaveToClasses = leaveTo.split(" ").filter((s) => s.length);

  function addClasses(node: HTMLElement, classes: string[]) {
    classes.length && node.classList.add(...classes);
  }

  function removeClasses(node: HTMLElement, classes: string[]) {
    classes.length && node.classList.remove(...classes);
  }

  return (
    <ReactCSSTransition
      appear={appear}
      unmountOnExit
      in={show}
      addEndListener={(node, done) => {
        node.addEventListener("transitionend", done, false);
      }}
      onEnter={(node: HTMLElement) => {
        addClasses(node, [...enterClasses, ...enterFromClasses]);
      }}
      onEntering={(node: HTMLElement) => {
        removeClasses(node, enterFromClasses);
        addClasses(node, enterToClasses);
      }}
      onEntered={(node: HTMLElement) => {
        removeClasses(node, [...enterToClasses, ...enterClasses]);
      }}
      onExit={(node) => {
        addClasses(node, [...leaveClasses, ...leaveFromClasses]);
      }}
      onExiting={(node) => {
        removeClasses(node, leaveFromClasses);
        addClasses(node, leaveToClasses);
      }}
      onExited={(node) => {
        removeClasses(node, [...leaveToClasses, ...leaveClasses]);
      }}
    >
      {children}
    </ReactCSSTransition>
  );
}

function Transition({
  show,
  appear,
  ...rest
}: TransitionProps): React.ReactElement {
  const { parent } = useContext(TransitionContext);
  const isInitialRender = useIsInitialRender();
  const isChild = show === undefined;

  if (isChild) {
    return (
      <CSSTransition
        appear={parent.appear || !parent.isInitialRender}
        show={parent.show}
        {...rest}
      />
    );
  }

  return (
    <TransitionContext.Provider
      value={{
        parent: {
          show,
          isInitialRender,
          appear,
        },
      }}
    >
      <CSSTransition appear={appear} show={show} {...rest} />
    </TransitionContext.Provider>
  );
}

export default Transition;
