// Copyright 2022 the Deno authors. All rights reserved. MIT license.

import { Header as DocComponentsHeader } from "$doc_components/header.tsx";
import GlobalSearch from "@/islands/GlobalSearch.tsx";

export function Header({ manual }: {
  manual?: boolean;
}) {
  return <DocComponentsHeader manual={manual} search={<GlobalSearch />} />;
}
