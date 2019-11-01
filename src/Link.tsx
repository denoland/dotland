// Ideally this file can be removed.
//
// Its funny how the simplest things get super complicated in React.
//
// If we use <a href> the browser makes a new get request to the server to get
// the HTML file for whatever URL we linked to. It has to go thru the worker and
// re send the HTML. That HTML needs to get reinterpreted and it has to fetch
// the JS again (probably from cache). All of the JavaScript has to re-render
// the page from 0 again. It has to re-fetch all of its data (for example for
// the registry).
//
// Instead of using href to redirect, we use our built in router - react-router
// - to do all of the navigation on the client. That way we don't have to
// request anything from the server again and the client state gets maintained -
// this is the reasons that SPA's are so fast after first load. After clicking
// on a element we tell react router to push the new URL into the URL bar so the
// user can see that we navigated (using navigator.history). At the same time a
// 'navigation' event gets triggered in the react-router BrowserRouter. This
// causes react-router to route to the correct component again client side. All
// of this happens without any requests to the server.
//
// The issue we have run into multiple times is that we try to navigate to
// external URL's using the internal linking from react-router. This because we
// try to push a url from a different origin onto the navigator.history (which
// is not allowed), so instead we get routed to
// https://deno.land/http://the.place/to/link/to. Fix: use href for external
// links.
//
// We cant use <a> because that does not receive material-ui styling so we have
// to use instead which does the exact same as <a>, just with styling.
//
// In short:
// Use <Link href=""> for external links and <Link component={InternalLink}
// to=""> for internal links. If it could be either then use href - this slows
// down internal redirects, but it is safer. These are Link components from
// material-ui.

import React from "react";
import { HashLink, HashLinkProps } from "react-router-hash-link";
import { Link as MaterialLink } from "@material-ui/core";
import { LinkProps } from "@material-ui/core/Link/Link";

export const InternalLink = React.forwardRef((props: HashLinkProps, ref) => (
  <HashLink {...props} />
));

/** isInternalLink checks if link is internal or external */
export function isInternalLink(link: string): Boolean {
  if (link.indexOf("://") === -1) return true;
  return false;
}

interface Props extends LinkProps {
  /** Supports internal and external links */
  to: string;
}

/** Use this component instead of MaterialUI's Link or ReactRouter's Link. */
export default function Link(props: Props) {
  if (isInternalLink(props.to)) {
    return <MaterialLink component={InternalLink} {...props} />;
  } else {
    return <MaterialLink {...props} component="a" href={props.to} />;
  }
}
