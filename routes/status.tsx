// Copyright 2022-2023 the Deno authors. All rights reserved. MIT license.

import { Handlers, PageProps, RouteConfig } from "$fresh/server.ts";
import type { Build } from "$apiland_types";
import { ContentMeta } from "@/components/ContentMeta.tsx";
import { Header } from "@/components/Header.tsx";
import { Footer } from "$doc_components/footer.tsx";
import { ErrorMessage } from "@/components/ErrorMessage.tsx";
import * as Icons from "@/components/Icons.tsx";

export default function StatusPage({ data, params }: PageProps<Build | null>) {
  return (
    <>
      <ContentMeta
        title="Publish Status"
        description="The status of the publish webhook for the third party
          registry."
        creator="@deno_land"
        keywords={["deno", "module", "registry", "status"]}
      />
      <div class="bg-gray-50 min-h-full">
        <Header />
        <div class="section-x-inset-md mt-8 pb-8 mb-16">
          <div>
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              Module publishing status
            </h3>
            {data &&
              (
                <p class="max-w-2xl text-sm leading-5 text-gray-500">
                  deno.land/x{data ? "/" + data.module : ""}
                </p>
              )}
          </div>
          {data
            ? (
              <div class="mt-5 border-t border-gray-200 pt-5">
                <dl>
                  <div class="sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt class="text-sm leading-5 font-medium text-gray-500">
                      Repository
                    </dt>
                    <dd class="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
                      <a
                        href={`https://github.com/${data.upload_options.repository}`}
                        class="link"
                      >
                        <Icons.GitHub />
                        {data.upload_options.repository}
                      </a>
                    </dd>
                  </div>
                  <div class="mt-8 sm:grid sm:mt-5 sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                    <dt class="text-sm leading-5 font-medium text-gray-500">
                      Version
                    </dt>
                    <dd class="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
                      {data.version}
                    </dd>
                  </div>
                  <div class="mt-8 sm:grid sm:mt-5 sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                    <dt class="text-sm leading-5 font-medium text-gray-500">
                      Source
                    </dt>
                    <dd class="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
                      <a
                        href={`https://github.com/${data.upload_options.repository}/tree/${data.upload_options.ref}/${
                          data.upload_options.subdir ?? ""
                        }`}
                        class="link"
                      >
                        View on GitHub
                      </a>
                    </dd>
                  </div>
                  <div class="mt-8 sm:grid sm:mt-5 sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                    <dt class="text-sm leading-5 font-medium text-gray-500">
                      Status
                    </dt>
                    <dd class="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
                      <div class="flex">
                        <div class="mr-2">
                          {(() => {
                            switch (data.status) {
                              case "queued":
                                return <Icons.Clock />;
                              case "publishing":
                                return <Icons.Reload />;
                              case "success":
                                return <Icons.Checkmark />;
                              case "error":
                                return <Icons.WarningTriangle />;
                            }
                          })()}
                        </div>
                        <div>
                          {data.status[0].toUpperCase()}
                          {data.status.substring(1)}
                        </div>
                      </div>
                      {data.message && (
                        <div class="flex mt-2">
                          <div class="mr-2">
                            <Icons.ChevronRight />
                          </div>
                          <div>{data.message}</div>
                        </div>
                      )}
                    </dd>
                  </div>
                </dl>
              </div>
            )
            : (
              <ErrorMessage title="404 - Not Found">
                Build ID '{params.id}' does not exist
              </ErrorMessage>
            )}
        </div>
        <Footer />
      </div>
    </>
  );
}

export const handler: Handlers<Build | null> = {
  async GET(_, { params, render }) {
    const res = await fetch("https://apiland.deno.dev/v2/builds/" + params.id);
    if (res.status !== 200) {
      return render!(null);
    } else {
      return render!(await res.json());
    }
  },
};

export const config: RouteConfig = { routeOverride: "/status/:id" };
