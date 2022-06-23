// Copyright 2022 the Deno authors. All rights reserved. MIT license.

/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, h } from "preact";
import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps, RouteConfig } from "$fresh/server.ts";
import { tw } from "@twind";
import { Header } from "@/components/Header.tsx";
import { Footer } from "@/components/Footer.tsx";
import { Build, getBuild } from "@/util/registry_utils.ts";
import { ErrorMessage } from "@/components/ErrorMessage.tsx";
import * as Icons from "@/components/Icons.tsx";

export default function StatusPage({ data }: PageProps<Build | Error>) {
  return (
    <>
      <Head>
        <title>发布状态 | Deno</title>
      </Head>
      <div class={tw`bg-gray-50 min-h-full`}>
        <Header />
        <div
          class={tw
            `max-w-screen-md mx-auto px-4 sm:px-6 md:px-8 mt-8 pb-8 mb-16`}
        >
          <div>
            <h3 class={tw`text-lg leading-6 font-medium text-gray-900`}>
              模块发布状态
            </h3>
            {!(data instanceof Error) &&
              (
                <p class={tw`max-w-2xl text-sm leading-5 text-gray-500`}>
                  deno.land/x{data ? "/" + data.options.moduleName : ""}
                </p>
              )}
          </div>
          {(data instanceof Error)
            ? (
              <ErrorMessage title="Failed to load build ID">
                {data.message}
              </ErrorMessage>
            )
            : (
              <div class={tw`mt-5 border-t border-gray-200 pt-5`}>
                <dl>
                  <div class={tw`sm:grid sm:grid-cols-3 sm:gap-4`}>
                    <dt class={tw`text-sm leading-5 font-medium text-gray-500`}>
                      仓库
                    </dt>
                    <dd
                      class={tw
                        `mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2`}
                    >
                      <a
                        href={`https://github.com/${data.options.repository}`}
                        class={tw`link`}
                      >
                        <Icons.GitHub />
                        {data.options.repository}
                      </a>
                    </dd>
                  </div>
                  <div
                    class={tw
                      `mt-8 sm:grid sm:mt-5 sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5`}
                  >
                    <dt class={tw`text-sm leading-5 font-medium text-gray-500`}>
                      版本
                    </dt>
                    <dd
                      class={tw
                        `mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2`}
                    >
                      {data.options.version}
                    </dd>
                  </div>
                  <div
                    class={tw
                      `mt-8 sm:grid sm:mt-5 sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5`}
                  >
                    <dt class={tw`text-sm leading-5 font-medium text-gray-500`}>
                      源码
                    </dt>
                    <dd
                      class={tw
                        `mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2`}
                    >
                      <a
                        href={`https://github.com/${data.options.repository}/tree/${data.options.ref}/${
                          data.options.subdir ?? ""
                        }`}
                        class={tw`link`}
                      >
                        在 GitHub 查看
                      </a>
                    </dd>
                  </div>
                  <div
                    class={tw
                      `mt-8 sm:grid sm:mt-5 sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5`}
                  >
                    <dt class={tw`text-sm leading-5 font-medium text-gray-500`}>
                      状态
                    </dt>
                    <dd
                      class={tw
                        `mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2`}
                    >
                      <div class={tw`flex`}>
                        <div class={tw`mr-2`}>
                          {(() => {
                            switch (data.status) {
                              case "queued":
                                return <Icons.Clock />;
                              case "publishing":
                                return <Icons.Reload />;
                              case "success":
                                return <Icons.Checkmark />;
                              case "failure":
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
                        <div class={tw`flex mt-2`}>
                          <div class={tw`mr-2`}>
                            <Icons.ThinArrowRight />
                          </div>
                          <div>{data.message}</div>
                        </div>
                      )}
                    </dd>
                  </div>
                </dl>
              </div>
            )}
        </div>
        <Footer />
      </div>
    </>
  );
}

export const handler: Handlers<Build | Error> = {
  async GET(req, { params, render }) {
    return render!(await getBuild(params.id));
  },
};

export const config: RouteConfig = { routeOverride: "/status/:id" };
