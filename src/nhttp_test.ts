import { Handler, Router } from "../mod.ts";
import { nhttp } from "./nhttp.ts";
import { assertEquals, superdeno } from "./deps_test.ts";
import { TRet } from "./types.ts";
import { expressMiddleware } from "./utils.ts";
import { mockConn } from "https://deno.land/std@0.170.0/http/_mock_conn.ts";
import _ from "https://jspm.dev/npm:call-bind@1.0.2!cjs";

const req = (method: string, url: string, body?: BodyInit) => {
  return new Request("http://127.0.0.1:8000" + url, { method, body });
};
Deno.test("nhttp", async (t) => {
  await t.step("wildcard", async () => {
    const app = nhttp();
    app.get("*", ({ params }) => params);
    app.any("/any/*", ({ params }) => params);
    app.post("/*/:id", ({ params }) => params);
    app.put("/:slug*", ({ params }) => params);
    app.patch("/:slug*/:id", ({ params }) => params);
    await superdeno(app.handle).get("/hello").expect({
      wild: ["hello"],
    });
    await superdeno(app.handle).get("/hello/").expect({
      wild: ["hello"],
    });
    await superdeno(app.handle).post("/hello/123").expect({
      wild: ["hello"],
      id: "123",
    });
    await superdeno(app.handle).post("/hello/123/").expect({
      wild: ["hello"],
      id: "123",
    });
    await superdeno(app.handle).put("/hello/123").expect({
      slug: ["hello", "123"],
    });
    await superdeno(app.handle).put("/hello/123/").expect({
      slug: ["hello", "123"],
    });
    await superdeno(app.handle).patch("/hello/world/123").expect({
      slug: ["hello", "world"],
      id: "123",
    });
    await superdeno(app.handle).patch("/hello/world/123/").expect({
      slug: ["hello", "world"],
      id: "123",
    });
    await superdeno(app.handle).delete("/any/hello").expect({
      wild: ["hello"],
    });
  });
  await t.step("handle", async () => {
    const app = nhttp({ env: "production" });
    app.get("/", (rev) => rev.getCookies());
    app.get("/promise", async () => await new Promise((res) => res("ok")));
    app.post("/post", () => "post");
    app.head("/", () => "head");
    app.get("/hello", ({ response }) => {
      return response.send([]);
    });
    app.get("/noop", () => {});
    app.get("/noop2", async () => {});
    await superdeno(app.handle).get("/").expect({});
    await superdeno(app.handle).get("/promise?name=john").expect("ok");
    await superdeno(app.handle).post("/post/").expect("post");
    await superdeno(app.handle).get("/hello").expect([]);
    const head = await app.handleEvent(
      { request: req("HEAD", "/") },
    );
    const noop = await app.handle(req("GET", "/noop"), {}, {});
    const noop2 = await app.handle(req("GET", "/noop2"));
    assertEquals(await head.text(), "head");
    assertEquals(noop, undefined);
    assertEquals(noop2, undefined);
  });
  await t.step("middleware", async () => {
    const app = nhttp();
    const midd: Handler = (rev, next) => {
      if (rev.count === undefined) {
        rev.count = 0;
      }
      rev.count += 1;
      return next();
    };
    app.use(midd);
    app.use(midd, [midd, [midd]], midd);
    app.use("/assets/hello", ({ count }) => count);
    app.use("/hello", () => "hello");
    app.use("/name", (rev, next) => {
      rev.name = "john";
      return next();
    });
    app.get("/name", ({ name }) => name);
    await superdeno(app.handle).get("/assets/hello/doe/john").expect("5");
    await superdeno(app.handle).get("/hello").expect("hello");
    await superdeno(app.handle).get("/name").expect("john");
  });
  await t.step("assets", async () => {
    const app = nhttp();
    const midd: Handler = (rev, _next) => {
      return rev.url;
    };
    app.use("/assets", midd);
    await superdeno(app.handle).get("/assets/hello").expect("/hello");
  });
  await t.step("noop 404", async () => {
    const app = nhttp();
    app.get("/", (_, next) => next());
    app.get("/hello", async (_, next) => await next());
    await superdeno(app.handle).get("/").expect(404);
    await superdeno(app.handle).get("/hello").expect(404);
  });
  await t.step("middleware express", async () => {
    const app = nhttp();
    const midd: TRet = (_req: TRet, _res: TRet, next: TRet) => {
      next();
    };
    app.use(midd, expressMiddleware([midd]));
    app.get("/", ({ response, respond, getHeaders }) => {
      response.setHeader("name", "john");
      response.getHeader("name");
      response.get("name");
      response.hasHeader("name");
      response.hasHeader("test");
      response.append("name", "sahimar");
      response.removeHeader("name");
      response.writeHead(200, { name: "john" });
      assertEquals(typeof getHeaders(), "object");
      respond({ body: "base" });
    });
    app.get("/hello", async ({ respond }) => {
      await respond({ body: "hello" });
    });
    const init = await app.handle(req("GET", "/"));
    const hello = await app.handle(req("GET", "/hello"));
    assertEquals(await init.text(), "base");
    assertEquals(await hello.text(), "hello");
  });
  await t.step("sub router", async () => {
    const app = nhttp();
    const user = new Router();
    const item = new Router();
    const book = new Router({ base: "/book" });
    const name = new Router({ base: "/" });
    const hobby = new Router();
    item.use("/item", (rev, next) => {
      rev.name = "item";
      return next();
    });
    item.get("/item", ({ name }) => name);
    user.get("/user", () => "user");
    book.get("/", () => "book");
    name.get("/name", () => "name");
    hobby.get(/\/hobby/, () => "hobby");
    app.use("/api/v1", user);
    app.use("/api/v2", [item, book, name, hobby]);
    await superdeno(app.handle).get("/api/v1/user").expect("user");
    await superdeno(app.handle).get("/api/v2/item").expect("item");
    await superdeno(app.handle).get("/api/v2/book").expect("book");
    await superdeno(app.handle).get("/api/v2/name").expect("name");
    await superdeno(app.handle).get("/api/v2/hobby").expect("hobby");
  });
  await t.step("error handling", async () => {
    const app = nhttp();
    app.get("/", ({ noop }) => noop());
    app.get("/noop", async ({ noop }, next) => {
      try {
        await noop();
        return "success";
      } catch (error) {
        error.status = 400;
        return next(error);
      }
    });
    app.get("/noop2", async ({ noop }, next) => {
      try {
        await noop();
        return "success";
      } catch (error) {
        error.status = "400";
        return next(error);
      }
    });
    app.onError((err) => err.message);
    app.on404(() => "404");
    const noop = app.handle(req("GET", "/"));
    const noop2 = app.handle(req("GET", "/noop"));
    const noop3 = app.handle(req("GET", "/noop2"));
    const notFound = app.handle(req("GET", "/404"));
    assertEquals(await noop.text(), "noop is not a function");
    assertEquals(await notFound.text(), "404");
    assertEquals((await noop2).status, 400);
    assertEquals((await noop3).status, 500);
  });
  await t.step("error handling default", async () => {
    const app = nhttp();
    app.get("/", ({ noop }) => noop());
    app.get("/2", async ({ noop }) => await noop());
    const noop = app.handle(req("GET", "/"));
    const noop2 = await app.handle(req("GET", "/2"));
    const notFound = app.handle(req("GET", "/404"));
    const message = (await noop.json()).message;
    const message2 = (await noop2.json()).message;
    const status = (await notFound.json()).status;
    assertEquals(message, "noop is not a function");
    assertEquals(message2, "noop is not a function");
    assertEquals(status, 404);
  });
  await t.step("option parse query", async () => {
    const app = nhttp({ parseQuery: (str: string) => str });
    app.get("/", ({ __parseQuery }) => __parseQuery("test"));
    const val = app.handle(req("GET", "/"));
    assertEquals(await val.text(), "test");
  });
  await t.step("params", async () => {
    const app = nhttp();
    app.get("/:name", ({ params }) => params);
    const val = app.handle(req("GET", "/john"));
    assertEquals(await val.text(), `{"name":"john"}`);
  });
  await t.step("conn", async () => {
    const conn = mockConn();
    const app = nhttp();
    app.get("/", () => "hello");
    const ret = await app["handleConn"](conn, app.handle);
    assertEquals(ret, undefined);
  });
  await t.step("listen", async () => {
    const def_port = 8080;
    const app = nhttp();
    const ac = new AbortController();
    app.get("/", () => "hello");
    const info: TRet = await new Promise((ok) => {
      app.listen({
        signal: ac.signal,
        port: def_port,
        test: true,
      }, (_, obj) => {
        ok(obj);
      });
    });
    const infoSSL: TRet = await new Promise((ok) => {
      app.listen({
        port: def_port + 1,
        cert: "./dummy/localhost.cert",
        key: "./dummy/localhost.key",
        alpnProtocols: ["h2", "http/1.1"],
        test: true,
      }, (_, info) => {
        ok(info);
      });
    });
    ac.abort();
    assertEquals(info.port, def_port);
    assertEquals(infoSSL.port, def_port + 1);
  });
});
