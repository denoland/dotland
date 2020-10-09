/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import useSWR from "swr";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { getBuild } from "../../util/registry_utils";
import { ErrorMessage } from "../../components/Registry";
import { CookieBanner } from "../../components/CookieBanner";

function StatusPage(): React.ReactElement {
  const { query } = useRouter();
  const id = (query.id as string) ?? "";

  const { data, error } = useSWR(id, getBuild, { refreshInterval: 5 });

  return (
    <>
      <Head>
        <title>Publish Status | Deno</title>
      </Head>
      <CookieBanner />
      <div className="bg-gray-50 min-h-full">
        <Header />
        <div className="max-w-screen-md mx-auto px-4 sm:px-6 md:px-8 mt-8 pb-8 mb-16">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Module publishing status
            </h3>
            <p className="max-w-2xl text-sm leading-5 text-gray-500">
              deno.land/x{data ? "/" + data.options.moduleName : ""}
            </p>
          </div>
          {error && (
            <ErrorMessage
              title="Failed to load build ID"
              body={error.message}
            />
          )}
          {data && (
            <div className="mt-5 border-t border-gray-200 pt-5">
              <dl>
                <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm leading-5 font-medium text-gray-500">
                    Repository
                  </dt>
                  <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
                    <a
                      href={`https://github.com/${data.options.repository}`}
                      className="link"
                    >
                      <svg
                        className="h-5 w-5 mr-2 inline"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {data.options.repository}
                    </a>
                  </dd>
                </div>
                <div className="mt-8 sm:grid sm:mt-5 sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                  <dt className="text-sm leading-5 font-medium text-gray-500">
                    Version
                  </dt>
                  <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
                    {data.options.version}
                  </dd>
                </div>
                <div className="mt-8 sm:grid sm:mt-5 sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                  <dt className="text-sm leading-5 font-medium text-gray-500">
                    Source
                  </dt>
                  <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
                    <a
                      href={`https://github.com/${
                        data.options.repository
                      }/tree/${data.options.ref}/${data.options.subdir ?? ""}`}
                      className="link"
                    >
                      View on GitHub
                    </a>
                  </dd>
                </div>
                <div className="mt-8 sm:grid sm:mt-5 sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                  <dt className="text-sm leading-5 font-medium text-gray-500">
                    Status
                  </dt>
                  <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
                    <div className="flex">
                      <div className="mr-2">
                        {(() => {
                          switch (data.status) {
                            case "queued":
                              return (
                                <svg
                                  className="w-5 h-5 text-gray-500"
                                  fill="none"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                              );
                            case "publishing":
                              return (
                                <svg
                                  className="w-5 h-5 text-yellow-400"
                                  fill="none"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                </svg>
                              );
                            case "success":
                              return (
                                <svg
                                  className="w-5 h-5 text-green-500"
                                  fill="none"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                              );
                            case "failure":
                              return (
                                <svg
                                  className="w-5 h-5 text-red-500"
                                  fill="none"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                                </svg>
                              );
                          }
                        })()}
                      </div>
                      <div>
                        {data.status[0].toUpperCase()}
                        {data.status.substring(1)}
                      </div>
                    </div>
                    {data.message && (
                      <div className="flex mt-2">
                        <div className="mr-2">
                          <svg
                            className="w-5 h-5 text-gray-500"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M9 5l7 7-7 7"></path>
                          </svg>
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

export default StatusPage;
