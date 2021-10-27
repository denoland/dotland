# dotland

[![Build Status](https://github.com/denoland/dotland/workflows/ci/badge.svg?branch=main&event=push)](https://github.com/denoland/dotland/actions)

Это исходный код https://deno.land/

Этот сайт состоит из двух частей

1. Cloudflare Worker
2. Next.js приложение с хостингом на Vercel

Мы хотим предоставить красивые и семантические URL-адреса для модулей, 
которые будут использоваться в Deno.
Например: https://deno.land/std/http/server.ts

когда мы запрашиваем этот файл внутри Deno, нам нужно получить необработанное
содержимое этого файла. Но когда мы посещаем этот URL в браузере мы хотим видеть
приятный HTML файл с подсветкой синтаксиса.

Для этого Cloudflare Worker ищет заголовок HTTP "Accept:"  чтобы узнать
нужен ли HTML клиент. Если нужен HTTP то мы просто проксируем запрос на
Vercel. (Мы используем Vercel из-за его прекрасной интеграции с GitHub.)

## История

Это переделка сайта Deno она объединяет код
https://github.com/denoland/deno/tree/f96aaa802b245c8b3aeb5d57b031f8a55bb07de2/website
и https://github.com/denoland/registry aи имеет быстрое развертывание.

Сайт написан на React / TailwindCSS / Vercel / CloudFlare Workers. Не на
Deno. В идеале его бы портировать на Deno в какой-то момент, но мы нуждаемся в
новом сайте а поиски занимают слишком много времени. Мы надеемся увидеть этот код
портированным на Deno с минимальным прерыванием потока разработки (в частности, 
нам нужна возможность прослушивать события FS и перезагружать веб-сервер)

## Лицензии изображений

Эти образы Deno распространяются по лицензии MIT.(public domain and free
for use).

- [A graphic for the v1 blog post by @hashrock](https://deno.land/v1.jpg)
