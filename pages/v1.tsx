/* Copyright 2020 the Deno authors. All rights reserved. MIT license. */

import React from "react";
import Head from "next/head";
import CodeBlock from "../components/CodeBlock";

import { complexExampleProgram } from ".";
import Footer from "../components/Footer";
import Header from "../components/Header";

const V1 = () => {
  return (
    <>
      <Head>
        <title>Deno 1.0</title>
        <meta
          name="description"
          content="Deno, a secure runtime for JavaScript and TypeScript."
        />
      </Head>
      <Header small />
      <img
        src="/v1_banner.jpeg"
        alt=""
        className="object-cover md:h-64 w-full border-b border-gray-200"
      />
      <div className="max-w-screen-md mx-auto px-4 sm:px-6 md:px-8 py-8">
        <h1 className="text-3xl tracking-tight font-bold text-5xl leading-10 mt-4">
          Deno 1.0
        </h1>
        <p className="text-gray-500 mt-3">Monday, March 9th 2020</p>
        <p className="mt-8">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
          vitae pulvinar quam. Suspendisse rutrum libero vitae elit egestas,
          eget laoreet metus aliquet. Donec sodales sapien mauris. Cras at
          finibus lacus. Aliquam erat volutpat. Mauris sagittis at lorem nec
          faucibus. Nullam quam lectus, elementum sit amet egestas eget, mollis
          sed arcu. Nam at egestas arcu, quis pellentesque lorem. Pellentesque
          auctor scelerisque velit sed fringilla. Donec congue sapien augue,
          eget aliquet est sagittis eget. Nulla lobortis placerat cursus. Cras
          interdum pharetra leo volutpat sagittis. Quisque placerat diam ac leo
          viverra euismod.
        </p>
        <p className="mt-6">
          Curabitur iaculis placerat mi in accumsan. Ut condimentum quam leo, ut
          ullamcorper ante porttitor ut. Cras hendrerit, arcu eget cursus
          lacinia, augue neque blandit enim, sit amet convallis libero nisl sit
          amet augue. Integer finibus purus velit. Aenean sit amet nibh eros.
          Fusce id tincidunt leo. Proin accumsan rhoncus facilisis. Nam rutrum
          aliquam nulla, sit amet venenatis ipsum luctus sed. Aenean elementum
          tellus nibh, in varius erat vulputate eu. Sed scelerisque, magna sed
          feugiat aliquam, ante quam accumsan lectus, sit amet pulvinar purus
          urna eget diam. Mauris maximus scelerisque libero vitae posuere.
        </p>
        <h3 className="mt-8 text-2xl">A random header</h3>
        <p className="mt-4">
          Nam vehicula metus quam, a lobortis augue eleifend a. Aliquam erat
          volutpat. Aenean at convallis lacus. Proin sagittis vestibulum
          ultricies. Suspendisse dolor velit, egestas vitae feugiat a,
          condimentum et eros. Cras ac neque ut dolor aliquet egestas. Aenean
          magna justo, rutrum nec pellentesque luctus, fermentum eget ante.
          Nullam aliquet nisl neque, sit amet finibus lectus convallis sit amet.
          Proin non dictum elit. Ut mattis, libero sed mollis posuere, est diam
          suscipit nibh, eget iaculis lacus est at nunc.
        </p>
        <div className="mt-4">
          <CodeBlock code={complexExampleProgram} language="typescript" />
        </div>
        <p className="mt-6">
          Morbi non erat urna. Maecenas non ante dui. Quisque pellentesque lorem
          interdum augue vestibulum, nec finibus orci iaculis. Mauris vitae
          consequat nibh. Pellentesque convallis ex sit amet ligula vulputate,
          non luctus massa iaculis. Morbi vitae lorem ac odio laoreet molestie.
          Quisque sollicitudin pretium neque id dictum.
        </p>
        <h3 className="mt-8 text-2xl">Another header</h3>
        <p className="mt-4">
          Nunc pellentesque aliquam sapien, nec tempus nisi porta a. Sed
          consequat enim sit amet tortor fermentum varius. Aenean blandit
          hendrerit ante, quis viverra justo fermentum tincidunt. In egestas non
          dolor eu eleifend. Pellentesque cursus vitae justo sed tempus. Vivamus
          mattis sem sed iaculis rutrum. Vivamus at consectetur augue. Nullam
          rutrum mollis sapien, ac eleifend lorem sollicitudin vel. Etiam eu dui
          pretium, ultricies justo nec, elementum nisi. Ut viverra gravida
          eleifend. Integer mollis, diam id efficitur lobortis, odio nisi
          elementum tortor, sit amet convallis turpis erat vitae lectus.
          Pellentesque sit amet ornare nisi.
        </p>
        <div className="mt-4">
          <CodeBlock code={complexExampleProgram} language="typescript" />
        </div>
        <p className="mt-6">
          Donec bibendum venenatis purus, sed luctus tellus imperdiet tristique.
          Phasellus imperdiet viverra nunc, bibendum volutpat nibh scelerisque
          ut. Aenean scelerisque dictum ultrices. Integer nec sem nec felis
          rutrum maximus. Cras eleifend mi a placerat congue. Suspendisse id
          lacus sem. Nam volutpat fermentum vehicula. Aliquam tellus justo,
          mollis vel feugiat a, bibendum ut justo. Curabitur nec facilisis orci.
          Vestibulum feugiat mi a eros ultricies, ornare rhoncus dolor
          convallis. Sed vitae neque semper sem rhoncus hendrerit eget aliquam
          ante. Suspendisse a convallis magna. Nam luctus felis urna, vitae
          molestie ligula faucibus at. Nam elementum tristique ornare.
          Vestibulum ligula magna, eleifend non dui ac, posuere sollicitudin
          nulla.
        </p>
        <div className="mt-4">
          <CodeBlock code={complexExampleProgram} language="typescript" />
        </div>
        <p className="mt-6">
          Pellentesque tincidunt eros et congue tristique. Pellentesque rhoncus
          eget augue eget suscipit. Aliquam lorem turpis, rhoncus non accumsan
          vel, efficitur eget risus. Praesent orci nunc, sodales ac velit nec,
          porta fermentum ex. Phasellus tincidunt gravida dignissim. Nunc non
          augue quis tortor blandit imperdiet. Aliquam tempus nunc ut nisl
          finibus accumsan. Mauris diam dui, sagittis non enim at, blandit
          gravida augue. Mauris nec ante facilisis, efficitur tortor ut, tempus
          urna. Vivamus congue mi tortor, et lacinia arcu accumsan ac.
          Pellentesque habitant morbi tristique senectus et netus et malesuada
          fames ac turpis egestas. Fusce ornare dapibus ante non bibendum.
        </p>
        <h3 className="mt-8 text-2xl">And another one</h3>
        <p className="mt-4">
          Nunc nec sollicitudin diam, maximus posuere dolor. Morbi tincidunt
          scelerisque ante, nec accumsan orci porttitor sit amet. Vestibulum non
          arcu mi. Vivamus eu porttitor lectus. Donec diam massa, mollis eu nisl
          a, tempor varius felis. Phasellus egestas vehicula pellentesque.
          Integer tempor convallis placerat. Proin eu arcu at turpis mattis
          ultrices. Suspendisse pulvinar rutrum mi, eu fermentum augue volutpat
          vitae. Etiam fermentum lorem porttitor egestas hendrerit. Suspendisse
          potenti. Maecenas mauris ipsum, porta eget tellus quis, iaculis
          tincidunt mauris. Etiam dignissim fermentum nibh et feugiat. Quisque
          justo dui, eleifend ut lorem eget, ullamcorper rutrum velit. Donec
          pretium vitae massa id pretium.
        </p>
        <p className="mt-6">
          Maecenas in est efficitur, interdum erat ac, vehicula dolor. Aenean
          faucibus enim eget turpis cursus vehicula. Ut congue malesuada arcu,
          non sagittis velit finibus id. Duis at lacus lobortis, blandit eros
          sit amet, tristique dolor. Nullam rutrum ac tellus ut ultricies. Donec
          commodo egestas lacus sed dignissim. Aliquam id blandit felis. Aenean
          congue mollis purus non faucibus. Lorem ipsum dolor sit amet,
          consectetur adipiscing elit.
        </p>
        <h3 className="mt-8 text-2xl">And the last one</h3>
        <p className="mt-4">
          Pellentesque habitant morbi tristique senectus et netus et malesuada
          fames ac turpis egestas. Cras sodales malesuada magna, sed dapibus
          arcu lacinia sit amet. Nullam ac vehicula mauris. Donec pharetra nec
          ante nec aliquam. Aliquam sit amet libero id est facilisis pretium
          vitae vel massa. Sed et vehicula elit. Suspendisse rhoncus vel justo
          eget finibus. Cras viverra est vitae ligula pharetra rutrum. Donec
          feugiat dolor fermentum porta suscipit. Cras ut nibh non nulla
          condimentum sollicitudin. Vivamus a iaculis nisl, dignissim dictum
          justo. Donec sagittis ex vitae ante commodo, vitae malesuada sem
          sagittis. Suspendisse luctus ornare augue sit amet sollicitudin.
          Phasellus eleifend, est eu cursus pulvinar, magna nisl pellentesque
          lorem, at euismod felis nulla mollis ipsum. Donec iaculis, nibh eget
          mollis sodales, neque turpis varius nisl, sed luctus dolor quam at
          lectus. Etiam a dui at urna vestibulum euismod.
        </p>
        <p className="italic mt-4 text-xl">The Deno Team</p>
      </div>
      <Footer />
    </>
  );
};

export default V1;
