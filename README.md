# Deno 中文网站

Deno 中文网站的源码。

我们希望为 Deno 的模块提供漂亮且语义化的 URL。例如: https://denoland-cn.deno.dev/std/http/server.ts

我们通过 HTTP 的 "Accept:" 头来判断客户端是否 是否需要 HTML。 如果它确实需要 HTML，我们只需渲染 html，否则我们 代理来自 S3
存储桶的文件内容。

- 中文手册 [denocn/deno_docs](https://github.com/denocn/deno_docs)

## 图片的许可协议

Deno 的图片基于 MIT 许可协议发布（发布到公共领域，可免费使用）。

- [在 V1 Blog 中用到的图片，由 @hashrock 创作](https://deno.land/v1.jpg)
