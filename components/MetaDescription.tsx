import React, { Fragment } from "react";

type Props = {
  labels: Record<"title" | "description" | "image", string>;
};

const DOMAIN_URL = "https://deno.land/";

const MetaDescription = ({ labels }: Props) => (
  <Fragment>
    <meta name="title" content={labels.title} />
    <meta name="description" content={labels.description} />

    <meta property="og:type" content="website" />
    <meta property="og:url" content={DOMAIN_URL} />
    <meta property="og:title" content={labels.title} />
    <meta property="og:description" content={labels.description} />
    <meta property="og:image" content={labels.image} />

    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content={DOMAIN_URL} />
    <meta property="twitter:title" content={labels.title} />
    <meta property="twitter:description" content={labels.description} />
    <meta property="twitter:image" content={labels.image} />
  </Fragment>
);

export default MetaDescription;
