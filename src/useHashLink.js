// Adapted from react-router-hash-link by Rafael Pedicini (MIT license)
// https://github.com/rafrex/react-router-hash-link/blob/06822346273c0548d79dacdf7d73ae48910c6b6f/src/index.js
//
// This module provides useHashLink() which should be called at the top-level of
// a React application. It ensure that the browser window is appropriately
// scrolled to anchor tags (hash links). This is necessary because the anchor
// tags might not exist when the page is initially rendered (like if there is a
// large markdown page being rendered).

import { useEffect } from "react";

let observer = null;
let timerId = null;

function getElAndScroll() {
  const id = window.location.hash.replace("#", "");
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView();
    reset();
  }
  return false;
}

function reset() {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
  if (timerId !== null) {
    window.clearTimeout(timerId);
    timerId = null;
  }
}

function hashLinkScroll() {
  const { hash } = window.location;
  if (hash !== "") {
    // Push onto callback queue so it runs after the DOM is updated,
    // this is required when navigating from a different page so that
    // the element is rendered on the page before trying to getElementById.
    setTimeout(() => {
      if (!getElAndScroll()) {
        if (!observer) {
          observer = new MutationObserver(getElAndScroll);
        }
        observer.observe(document, {
          attributes: true,
          childList: true,
          subtree: true
        });
        // if the element doesn't show up in 10 seconds, stop checking
        timerId = setTimeout(reset, 10000);
      }
    }, 0);
  }
}

export default function useHashLink() {
  useEffect(hashLinkScroll, []);
}
