/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, h } from "preact";
import { Head } from "$fresh/runtime.ts";
import { tw } from "@twind";
import { Footer } from "@/components/Footer.tsx";
import { Header } from "@/components/Header.tsx";
import * as Icons from "@/components/Icons.tsx";
import { Handlers, PageProps } from "$fresh/server.ts";
import { type State } from "@/routes/_middleware.ts";
import Hero from "@/islands/Hero.tsx";

export default function HeroPreviewPage() {
  return (
    <div>
      <Hero></Hero>
    </div>
  );
}
