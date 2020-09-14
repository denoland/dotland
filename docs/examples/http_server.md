<!-- # Simple HTTP web server -->
# 簡単なHTTP webサーバー

<!-- ## Concepts -->
## 概念

<!--
- Use the std library [http module](https://deno.land/std@$STD_VERSION/http) to
  run your own web server
-->
- stdライブラリ [http module](https://deno.land/std@$STD_VERSION/http) を使用し、webサーバーを実行します

<!-- ## Overview -->
## 概要

<!--
With just a few lines of code you can run your own http web server with control
over the response status, request headers and more.
-->
数行のコードでレスポンスステータスやリクエストヘッダーなどをコントールできるhttp webサーバーを実行することができます。

<!-- ## Sample web server -->
## 簡単なwebサーバー

<!-- In this example, the user-agent of the client is returned to the client -->
この例では、クライアントのuser-agentがクライアントに返されます。

```typescript
/** 
 * webserver.ts 
 */
import { serve } from "https://deno.land/std@$STD_VERSION/http/server.ts";

const server = serve({ hostname: "0.0.0.0", port: 8080 });
console.log(`HTTP webserver running.  Access it at:  http://localhost:8080/`);

for await (const request of server) {
  let bodyContent = "Your user-agent is:\n\n";
  bodyContent += request.headers.get("user-agent") || "Unknown";

  request.respond({ status: 200, body: bodyContent });
}
```

<!-- Run this with: -->
実行してください:

```shell
deno run --allow-net webserver.ts
```
