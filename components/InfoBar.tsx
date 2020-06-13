import React from "react";

export function InfoBar() {
  return (
    <div className="bg-black">
      <div className="max-w-screen-xl mx-auto py-8 sm:py-6 px-3 sm:px-6 lg:px-8">
        <p className="font-medium text-xl text-white flex flex-col lg:flex-row justify-start lg:justify-between w-full">
          <div className="font-bold">Black Lives Matter</div>
          <div>
            <a
              className="text-white underline"
              href="https://support.eji.org/give/153413/#!/donation/checkout"
            >
              Support the Equal Justice Initiative
            </a>
          </div>
        </p>
      </div>
    </div>
  );
}
