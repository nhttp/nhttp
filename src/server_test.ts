import { assertEquals } from "./deps_test.ts";
import { nhttp } from "./nhttp.ts";

Deno.test({
  name: "listen",
  permissions: { net: false },
  fn() {
    const app = nhttp();
    app.listen(8000, (_, info) => {
      assertEquals(info.port, 8000);
    });
    app.listen({
      port: 8001,
      certFile: "./dummy/localhost.cert",
      cert: "./dummy/localhost.cert",
      key: "./dummy/localhost.key",
      keyFile: "./dummy/localhost.key",
      alpnProtocols: ["h2", "http/1.1"],
      hostname: "localhost",
      transport: "tcp",
      handler: () => new Response(),
      signal: new AbortController().signal,
    }, (_, info) => {
      assertEquals(info.port, 8001);
      assertEquals(info.cert, "./dummy/localhost.cert");
      assertEquals(info.key, "./dummy/localhost.key");
      assertEquals(info.alpnProtocols, ["h2", "http/1.1"]);
    });
    app.listen(8002);
    const app2 = nhttp({ flash: true });
    app2.listen(8003);
    app2.listen({
      port: 8004,
      handler: () => new Response("OK"),
    }, (_, info) => {
      assertEquals(info.port, 8004);
    });
    app2.listen({
      port: 8004,
      fetch: () => new Response("OK"),
    }, (_, info) => {
      assertEquals(info.port, 8004);
    });
    app2.listen({
      port: 8004,
      showInfo: true,
    }, (_, info) => {
      assertEquals(info.port, 8004);
    });
  },
});
Deno.test({
  name: "server misc",
  async fn(t) {
    await t.step("run server without callback", () => {
      const ac = new AbortController();
      const app = nhttp();
      app.get("/", () => "home");
      const server = app.listen({ port: 8081, signal: ac.signal });
      server?.shutdown();
    });
    await t.step("run server with callback", () => {
      const ac = new AbortController();
      const app = nhttp();
      app.get("/", () => "home");
      const server = app.listen({ port: 8082, signal: ac.signal }, () => {
        console.log("run");
      });
      server?.shutdown();
    });
  },
});
