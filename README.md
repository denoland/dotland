# deno 日本語サイト

![ci](https://github.com/tokiedokie/deno_website2_japanese/workflows/ci/badge.svg)

https://deno-ja.vercel.app/ のレポジトリです。

## 翻訳のやり方

`docs`下の`.md`ファイルは英文をHTMLコメント(`<!-- -->`)でコメントアウトし、その下に日本語訳を書いてください。英文が複数行に渡る場合、すべてをコメントアウトして日本語にしてください。英文が一行空いている場合はそれぞれ分けて日本語にしてください。

`.tsx`の英文はJSXのコメント(`{/* */}`)でコメントアウトし、その下に日本語訳を書いてください。

`docs/toc.json`は元のファイルです。日本語は`docs/toc.ja.json`に書いてください。

日本語訳に改行を入れないでください。改行されたとこで半角が入るのを嫌うためです。`.tsx`は改行しても空白が入らないとこあります。そこは改行していいです。

markdown中のコードとリンクの前後が句読点やカッコでない場合、空白を開けてください。

## History

This is a rewrite of the Deno website it will combine the code in
https://github.com/denoland/deno/tree/f96aaa802b245c8b3aeb5d57b031f8a55bb07de2/website
and https://github.com/denoland/registry and have faster deployment.

This is written in React / TailwindCSS / Vercel / CloudFlare Workers. Not in
Deno. Ideally this could be ported to Deno at some point but we are in need of a
new website and dogfooding takes too long. We hope to see this code ported to
Deno with minimal developer flow interrupted (in particular, we need the ability
to listen for FS events and reload the web server).

## Image License

These Deno images are distributed under the MIT license (public domain and free
for use).

- [A graphic for the v1 blog post by @hashrock](https://deno.land/v1.jpg)
