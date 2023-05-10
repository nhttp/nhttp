import { assertEquals } from "./deps_test.ts";
import { nhttp } from "./nhttp.ts";
import { HttpServer } from "./nhttp_util.ts";

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
    const listen = app.listen(8002);
    assertEquals(listen instanceof Promise, true);
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
  name: "server",
  async fn(t) {
    await t.step("run server", async () => {
      const ac = new AbortController();
      const app = nhttp();
      app.get("/", () => "home");
      const p = app.listen({ port: 8080, signal: ac.signal });
      const res = await fetch("http://localhost:8080/");
      assertEquals(res.ok, true);
      await res.body?.cancel();
      ac.abort();
      try {
        const server = new HttpServer(app.server, app.handle);
        server.close();
        server["alive"] = false;
        server.close();
      } catch (error) {
        assertEquals(error.message, "Server Closed");
      }
      await p;
    });
  },
});

Deno.test({
  name: "server flash",
  async fn(t) {
    await t.step("run server flash", async () => {
      const ac = new AbortController();
      const app = nhttp({ flash: true });
      app.get("/", () => "home");
      const p = app.listen({ port: 8081, signal: ac.signal });
      const res = await fetch("http://localhost:8081/");
      assertEquals(res.ok, true);
      await res.body?.cancel();
      ac.abort();
      await p;
    });
  },
});

Deno.test({
  name: "server flash with callback",
  async fn(t) {
    await t.step("run server flash", async () => {
      const ac = new AbortController();
      const app = nhttp({ flash: true });
      app.get("/", () => "home");
      const p = app.listen({ port: 8082, signal: ac.signal }, () => {
        console.log("run");
      });
      const res = await fetch("http://localhost:8082/");
      assertEquals(res.ok, true);
      await res.body?.cancel();
      ac.abort();
      await p;
    });
  },
});
