import React from "react";
import Footer from "./Footer";
import Header from "./Header";

function NotFoundPage(): React.ReactElement {
  return (
    <div className="NotFoundPage">
      <Header />
      <header>
        <h1 className="font-extrabold text-5xl leading-10 tracking-tight text-gray-900">
          404
        </h1>
        <h2 className="mt-4 sm:mt-5 font-light text-2xl text-center leading-tight text-gray-900">
          Couldn't find what you're looking for.
        </h2>
      </header>

      <div className="animation">
        <img src="images/ferris.gif" alt="Ferris" id="ferris404" />
        <img src="images/deno404.gif" alt="Deno not found ):" id="deno404" />

        <div className="land bg-gray-300">
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
