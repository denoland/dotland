import React, { useState, useEffect, useMemo } from "react";
import Transition from "./Transition";
import InlineCode from "./InlineCode";
import { getVersionList } from "../util/registry_utils";

const VALID_NAME = /[A-Za-z0-9_]{3,40}/;

function RegistryInstructions(props: { isOpen: boolean; close: () => void }) {
  const [stage, setStage] = useState(0);

  const [moduleName, setModuleName] = useState("");
  const [isModuleNameAvailable, setIsModuleNameAvailable] = useState<
    null | boolean
  >(null);

  const isModuleNameValid = useMemo(() => VALID_NAME.test(moduleName), [
    moduleName,
  ]);

  useEffect(() => {
    let cancel = false;
    if (isModuleNameValid) {
      getVersionList(moduleName)
        .then((e) => {
          if (!cancel) setIsModuleNameAvailable(!e);
        })
        .catch(() => {
          if (!cancel) setIsModuleNameAvailable(false);
        });
    } else {
      setIsModuleNameAvailable(null);
    }
    return () => {
      cancel = true;
    };
  }, [isModuleNameValid, moduleName]);

  useEffect(() => {
    if (props.isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.marginRight = "15px";
    } else {
      document.body.style.overflow = "";
      document.body.style.marginRight = "";
    }
  }, [props.isOpen]);

  return (
    <Transition show={props.isOpen}>
      <div className="fixed z-10 inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <Transition
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={props.close}
            ></div>
          </Transition>
          <section className="absolute inset-y-0 right-0 pl-10 max-w-full flex">
            <Transition
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className="relative w-screen max-w-md">
                <Transition
                  enter="ease-in-out duration-500"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-500"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 left-0 -ml-8 pt-4 pr-2 flex sm:-ml-10 sm:pr-4">
                    <button
                      aria-label="Close panel"
                      className="text-gray-300 hover:text-white transition ease-in-out duration-150"
                      onClick={props.close}
                    >
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </Transition>
                <div className="h-full flex flex-col space-y-4 py-6 bg-white shadow-xl overflow-y-auto">
                  <header className="px-4 sm:px-6">
                    <h2 className="text-xl leading-7 font-medium text-gray-900">
                      {stage === 0 && "Adding a module"}
                      {stage === 1 && "Select a module name"}
                      {stage === 2 && "Advanced options"}
                      {stage === 3 && "Add the webhook"}
                    </h2>
                  </header>
                  <div className="relative flex-1 px-4 sm:px-6 space-y-4">
                    {stage === 0 && (
                      <>
                        <p>
                          All modules on{" "}
                          <b className="font-semibold">deno.land/x</b> need to
                          be hosted as public repositories on GitHub.com.
                        </p>
                        <p>
                          <b className="font-semibold">deno.land/x</b> downloads
                          and stores your repository contents every time you
                          create a git tag. We only do this once for every tag.
                          This ensures that the contents we serve for a specific
                          version can never change.
                        </p>
                        <p>
                          Our service needs to get informed whenever a new tag
                          is created. For this purpose we use GitHub webhooks.
                        </p>
                        <span className="block w-full rounded-md shadow-sm mt-4">
                          <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-gray-300 text-md font-medium rounded-md text-gray-700 bg-gray-100 hover:text-gray-500 hover:bg-gray-50 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-gray-100 active:text-gray-700 transition duration-150 ease-in-out"
                            onClick={() => setStage(1)}
                          >
                            Next
                          </button>
                        </span>
                      </>
                    )}
                    {stage === 1 && (
                      <>
                        <p>To get started please select a module name:</p>
                        <div>
                          <label
                            htmlFor="modulename"
                            className="font-semibold sr-only"
                          >
                            Module Name
                          </label>
                          <input
                            id="modulename"
                            className={`block w-full px-4 py-2 my-1 leading-normal bg-white border border-gray-200 rounded-lg outline-none shadow hover:shadow-sm focus:shadow-sm appearance-none focus:border-gray-300 hover:border-gray-300 mt-1 ${
                              isModuleNameValid === true &&
                              isModuleNameAvailable === true
                                ? "border-green-300 hover:border-green-300 focus:border-green-300"
                                : isModuleNameValid === false ||
                                  isModuleNameAvailable === false
                                ? "border-red-300 hover:border-red-300 focus:border-red-300"
                                : ""
                            }`}
                            type="text"
                            placeholder="Module Name"
                            value={moduleName}
                            onChange={(e) => setModuleName(e.target.value)}
                          />
                          {isModuleNameAvailable === true ? (
                            <p className="text-green-500 mb-2">
                              This module name is available.
                            </p>
                          ) : isModuleNameAvailable === false ? (
                            <p className="text-red-400 mb-2">
                              This module name is not available.
                            </p>
                          ) : null}
                          {!isModuleNameValid ? (
                            <span className="text-red-400">
                              The module name must be between 3 and 40
                              characters and contain only the characters a-z,
                              A-Z, 0-9 and _.
                            </span>
                          ) : null}
                        </div>
                        <span className="block w-full rounded-md shadow-sm">
                          <button
                            type="submit"
                            disabled={!isModuleNameValid ? true : undefined}
                            className={`w-full flex justify-center py-2 px-4 border border-gray-300 text-md font-medium rounded-md ${
                              isModuleNameValid
                                ? "text-gray-700 bg-gray-100 hover:text-gray-500 hover:bg-gray-50"
                                : "text-gray-400 bg-gray-50 cursor-default"
                            } focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-gray-100 active:text-gray-700 transition duration-150 ease-in-out`}
                            onClick={() => setStage(3)}
                          >
                            Next
                          </button>
                        </span>
                        <button className="link" onClick={() => setStage(0)}>
                          Previous
                        </button>
                      </>
                    )}
                    {stage === 2 && (
                      <>
                        <p>There are some advanced options you can select:</p>
                        <span className="block w-full rounded-md shadow-sm">
                          <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-gray-300 text-md font-medium rounded-md text-gray-700 bg-gray-100 hover:text-gray-500 hover:bg-gray-50 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-gray-100 active:text-gray-700 transition duration-150 ease-in-out"
                            onClick={() => setStage(3)}
                          >
                            Next
                          </button>
                        </span>
                        <button className="link" onClick={() => setStage(1)}>
                          Previous
                        </button>
                      </>
                    )}
                    {stage === 3 && (
                      <>
                        <p>You can now add the webhook to your repository.</p>
                        <ol className="list-decimal list-outside ml-4 pl-2 ">
                          <li>Navigate to the repository you want to add.</li>
                          <li>
                            Go to the <InlineCode>Settings</InlineCode> tab.
                          </li>
                          <li>
                            Click on the <InlineCode>Webhooks</InlineCode> tab.
                          </li>
                          <li>
                            Click on the <InlineCode>Add webhook</InlineCode>{" "}
                            button.
                          </li>
                          <li>
                            Enter the URL{" "}
                            <InlineCode>
                              https://api.deno.land/webhook/gh/{moduleName}
                            </InlineCode>{" "}
                            in the payload URL field.
                          </li>
                          <li>
                            Select <InlineCode>application/json</InlineCode> as
                            the content type.
                          </li>
                          <li>
                            Select{" "}
                            <InlineCode>
                              Let me select individual events.
                            </InlineCode>
                          </li>
                          <li>
                            Select only the{" "}
                            <InlineCode>Branch or tag creation</InlineCode>{" "}
                            event.
                          </li>
                          <li>
                            Press <InlineCode>Add webhook</InlineCode>.
                          </li>
                        </ol>
                        <video
                          src="/images/add_webhook.mp4"
                          autoPlay
                          muted
                          loop
                        />
                        <span className="block w-full rounded-md shadow-sm">
                          <button
                            className="w-full flex justify-center py-2 px-4 border border-gray-300 text-md font-medium rounded-md text-gray-700 bg-gray-100 hover:text-gray-500 hover:bg-gray-50 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-gray-100 active:text-gray-700 transition duration-150 ease-in-out"
                            onClick={props.close}
                          >
                            Done
                          </button>
                        </span>
                        <button className="link" onClick={() => setStage(1)}>
                          Previous
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Transition>
          </section>
        </div>
      </div>
    </Transition>
  );
}

export default RegistryInstructions;
