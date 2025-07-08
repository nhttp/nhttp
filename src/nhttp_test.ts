import { type Handler, HttpError, Router } from "../mod.ts";
import { nhttp } from "./nhttp.ts";
import type { RequestEvent } from "./request_event.ts";
import { assertEquals, intertest } from "./deps_test.ts";
import type { NextFunction, TRet } from "./types.ts";

const renderFile = (file: string, ..._args: TRet) => {
  return Deno.readTextFileSync(file);
};
const renderFileAsync = (file: string, ..._args: TRet) => {
  return Deno.readTextFile(file);
};
const myReq = (method = "GET", url = "/", body?: TRet) => {
  return new Request("http://127.0.0.1:8000" + url, { method, body });
};
Deno.test("nhttp", async (t) => {
  await t.step("wildcard", async () => {
    const app = nhttp();
    app.get("*", (rev) => rev.params);
    app.any("/any/*", (rev) => rev.params);
    app.post("/*/:id", (rev) => rev.params);
    app.put("/:slug*", (rev) => rev.params);
    app.patch("/:slug*/:id", (rev) => rev.params);
    await app.req("/hello").json();
    await intertest(app).get("/hello").expect({
      wild: ["hello"],
    });
    await intertest(app).get("/hello/").expect({
      wild: ["hello"],
    });
    await intertest(app).post("/hello/123").expect({
      wild: ["hello"],
      id: "123",
    });
    await intertest(app).post("/hello/123/").expect({
      wild: ["hello"],
      id: "123",
    });
    await intertest(app).put("/hello/123").expect({
      slug: ["hello", "123"],
    });
    await intertest(app).put("/hello/123/").expect({
      slug: ["hello", "123"],
    });
    await intertest(app).patch("/hello/world/123").expect({
      slug: ["hello", "world"],
      id: "123",
    });
    await intertest(app).patch("/hello/world/123/").expect({
      slug: ["hello", "world"],
      id: "123",
    });
    await intertest(app).delete("/any/hello").expect({
      wild: ["hello"],
    });
  });
  await t.step("handle", async () => {
    const app = nhttp({ env: "production" });
    app.get("/promise", async () => await new Promise((res) => res("ok")));
    app.post("/post", (_rev) => "post");
    app.head("/", (_rev) => "head");
    app.get("/hello", ({ response }) => {
      return response.send([]);
    });
    app.get("/lose", (_, next) => next());
    app.get("/lose", (_rev) => "yeah");
    app.get("/lose/:name", (_, next) => next());
    app.get("/lose/:name", (_rev) => "yeah");
    app.get("/send", ({ response }) => {
      response.send();
    });
    app.get("/json-header", ({ response }) => {
      response.header("name", "john");
      response.json({ name: "john" });
    });
    app.get("/json-header2", ({ response }) => {
      response.header().append("name", "john");
      response.json({ name: "john" });
    });
    app.get("/status", ({ response }) => response.sendStatus(204));
    app.get("/status2", ({ response }) => response.sendStatus(1000));
    await intertest(app).get("/promise?name=john").expect("ok");
    await intertest(app).post("/post/").expect("post");
    await intertest(app).get("/hello").expect([]);
    await intertest(app).get("/lose").expect("yeah");
    await intertest(app).get("/lose/john").expect("yeah");
    await intertest(app).get("/status").expect(204);
    await intertest(app).get("/status2").expect(500);
    const head = await app.handleEvent(
      { request: myReq("HEAD", "/") },
    );
    const sendNull = await app.req("/send").res();
    const jsonHeader = await app.req("/json-header").res();
    const jsonHeader2 = await app.req("/json-header2").res();
    assertEquals(await head.text(), "head");
    assertEquals(sendNull instanceof Response, true);
    assertEquals(jsonHeader.headers.get("name"), "john");
    assertEquals(jsonHeader2.headers.get("name"), "john");
  });
  await t.step("noop response", async () => {
    const app = nhttp();
    app.get("/", (_rev) => {});
    const noop = await app.fetch(myReq());
    assertEquals(noop.status, 408);
  });
  await t.step("rev.route", async () => {
    const app = nhttp();
    app.get("/user", (rev) => {
      assertEquals(rev.route.path, "/user");
      assertEquals(rev.route.pattern instanceof RegExp, true);
      return "user";
    });
    const user = await app.req("/user/").text();
    assertEquals(user, "user");
  });
  await t.step("engine", async () => {
    const app = nhttp();
    app.engine((tmp, params) => {
      return { tmp, params };
    }, { base: "base", ext: "html" });
    app.get("/", ({ response }) => response.render("hello", { name: "john" }));
    await intertest(app).get("/").expect(200);
  });
  await t.step("body parser", async () => {
    const app = nhttp({ bodyParser: true });
    app.post("/", (rev) => rev.body);
    await intertest(app)
      .post("/")
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .send({ name: "john" })
      .expect({ name: "john" });
  });
  await t.step("engine1", async () => {
    const app = nhttp();
    app.engine(renderFile, { base: "/dummy", ext: "html" });
    app.get("/", ({ response }) => {
      response.params = { name: "john" };
      response.render("index");
    });
    await intertest(app).get("/").expect(200);
  });
  await t.step("engine2", async () => {
    const app = nhttp();
    app.engine(renderFileAsync, { base: "/dummy", ext: "html" });
    app.get("/", async ({ response }) => {
      response.params = { name: "john" };
      await response.render("index");
    });
    await intertest(app).get("/").expect(200);
  });
  await t.step("engine error", async () => {
    const app = nhttp();
    app.engine(renderFile, { base: "/dummy", ext: "html" });
    app.get("/", ({ response }) => {
      response.params = { name: "john" };
      response.render("noop");
    });
    await intertest(app).get("/").expect(500);
  });
  await t.step("engine jsx", async () => {
    const renderToHtml = (elem: TRet) => elem;
    renderToHtml.check = (elem: TRet) => typeof elem === "string";
    const app = nhttp();
    app.engine(renderToHtml);
    app.get("/", () => {
      return "hello";
    });
    await intertest(app).get("/").expect(200);
  });
  await t.step("engine jsx promise", async () => {
    const renderToHtml = async (elem: TRet) => await Promise.resolve(elem);
    renderToHtml.check = (elem: TRet) => typeof elem === "string";
    const app = nhttp();
    app.engine(renderToHtml);
    app.get("/", (_rev) => "hello");
    await intertest(app).get("/").expect(200);
  });
  await t.step("engine jsx promise error", async () => {
    const renderToHtml = async (elem: TRet) => {
      elem.noop();
      return await Promise.resolve(elem);
    };
    renderToHtml.check = (elem: TRet) => typeof elem === "string";
    const app = nhttp();
    app.engine(renderToHtml);
    app.get("/", (_rev) => "hello");
    await intertest(app).get("/").expect(500);
  });
  await t.step("engine jsx check false", async () => {
    const renderToHtml = (elem: TRet) => elem;
    renderToHtml.check = (elem: TRet) => typeof elem === "object";
    const app = nhttp();
    app.engine(renderToHtml);
    app.get("/", (_rev) => "hello");
    await intertest(app).get("/").expect(200);
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
    app.use("/hello", (_rev) => "hello");
    app.use("/name", (rev, next) => {
      rev.name = "john";
      return next();
    });
    app.get("/name", ({ name }) => name);
    app.use("/data", (rev, next) => {
      rev.name = "john";
      return next();
    });
    app.use("/data", ({ name }) => name);
    await intertest(app).get("/assets/hello/doe/john").expect("5");
    await intertest(app).get("/hello").expect("hello");
    await intertest(app).get("/name").expect("john");
    await intertest(app).get("/data").expect("john");
  });
  await t.step("assets", async () => {
    const app = nhttp();
    const midd: Handler = (rev, _next) => {
      return rev.url;
    };
    app.use("/hello/*", (rev, next) => {
      rev.user = "john";
      return next();
    });
    app.use("/assets", midd);
    app.get("/hello/john", ({ user }) => user);
    await intertest(app).get("/assets/hello").expect("/hello");
    await intertest(app).get("/hello/john").expect("john");
  });
  await t.step("noop 404", async () => {
    const app = nhttp();
    app.get("/", (_, next) => next());
    app.get("/hello", async (_, next) => await next());
    await intertest(app).get("/").expect(404);
    await intertest(app).get("/hello").expect(404);
  });
  await t.step("404 next error", async () => {
    const app = nhttp();
    app.get("/", (_, next) => next());
    app.on404((_rev, next) => {
      return next(new HttpError(500, "noop"));
    });
    await intertest(app).get("/hello").expect(500);
  });
  await t.step("404 next error", async () => {
    const app = nhttp();
    app.get("/", (_, next) => next());
    app.on404((_rev, next) => {
      return next(new Error());
    });
    await intertest(app).get("/hello").expect(500);
  });
  await t.step("404 next", async () => {
    const app = nhttp();
    app.on404((_rev, next) => {
      return next();
    });
    await intertest(app).get("/hello").expect(404);
  });
  await t.step("error next error", async () => {
    const app = nhttp();
    app.get("/", (rev) => rev.noop());
    app.onError((_e, _rev, next) => {
      return next(new HttpError(500, "noop"));
    });
    await intertest(app).get("/").expect(500);
  });
  await t.step("error next error2", async () => {
    const app = nhttp();
    app.get("/", (rev) => rev.noop());
    app.onError((_e, _rev, next) => {
      return next(new Error());
    });
    await intertest(app).get("/").expect(500);
  });
  await t.step("error next", async () => {
    const app = nhttp();
    app.get("/", (rev) => rev.noop());
    app.onError((_e, _rev, next) => {
      return next();
    });
    await intertest(app).get("/").expect(404);
  });
  await t.step("json bigint", async () => {
    const app = nhttp();
    app.get("/", () => ({ int: BigInt(9007199254740991) }));
    await intertest(app).get("/").expect(200);
  });
  await t.step("noop path", async () => {
    const app = nhttp();
    app.get("/hello/", (_rev) => "hello");
    await intertest(app).get("/hello").expect(200);
  });
  await t.step("app.req", async () => {
    const app = nhttp();
    app.get("/text", (_rev) => "hello");
    app.get("/json", (_rev) => ({ name: "hello" }));
    const text = await app.req("/text").text();
    const json = await app.req("/json").json();
    const ok = await app.req("/text").ok();
    const status = await app.req("/text").status();
    const res = await app.req("/text").res();
    assertEquals(text, "hello");
    assertEquals(json, { name: "hello" });
    assertEquals(ok, true);
    assertEquals(status, 200);
    assertEquals(res instanceof Response, true);
    const text2 = await app.req("http://127.0.0.1:8787/text").text();
    assertEquals(text2, "hello");
  });
  await t.step("class midd", async () => {
    class Midd {
      use(rev: RequestEvent, next: NextFunction) {
        rev.user = "john";
        return next();
      }
    }
    const app = nhttp();
    app.use(Midd);
    app.get("/", ({ user }) => user);
    await intertest(app).get("/").expect("john");
  });
  await t.step("middleware express", async () => {
    const app = nhttp();
    const midd: TRet = (_req: TRet, _res: TRet, next: TRet) => {
      next();
    };
    app.use(
      (rev, next) => {
        rev.headers.set("key", "val");
        return next();
      },
      midd,
    );
    app.get("/", ({ headers, response }) => {
      response.setHeader("name", "john");
      response.getHeader("name");
      response.get("name");
      response.hasHeader("name");
      response.hasHeader("test");
      response.append("name", "sahimar");
      response.removeHeader("name");
      response.writeHead(200, { name: "john" });
      headers.set("name", "john");
      headers.append("name", "kasja");
      assertEquals((headers as TRet).key, "val");
      assertEquals(typeof headers.get("name"), "string");
      assertEquals(typeof headers.entries(), "object");
      headers.forEach((val, key) => {
        assertEquals(typeof val, "string");
        assertEquals(typeof key, "string");
      });
      assertEquals(typeof headers.keys(), "object");
      assertEquals(typeof headers.values(), "object");
      assertEquals(headers.has("name"), true);
      headers.delete("name");
      return "base";
    });
    const init = await app.req("/").text();
    assertEquals(init, "base");
  });
  await t.step("sub router", async () => {
    const app = nhttp();
    const user = nhttp.Router();
    const item = new Router();
    const book = new Router({ base: "/book" });
    const name = new Router({ base: "/" });
    const hobby = new Router();
    const home = new Router();
    item.use("/item", (rev, next) => {
      rev.name = "item";
      return next();
    });
    book.use("/", (rev, next) => {
      rev.name = "book";
      return next();
    });
    home.use("/", (rev, next) => {
      rev.name = "home";
      return next();
    });
    item.get("/item", ({ name }) => name);
    user.get("/user", (_rev) => "user");
    book.get("/", ({ name }) => name);
    home.get("/", ({ name }) => name);
    name.get("/name", (_rev) => "name");
    hobby.get(/\/hobby/, (_rev) => "hobby");
    app.use("/api/v1", user);
    app.use("/api/v2", [item, book, name, hobby]);
    app.use(home);
    await intertest(app).get("/").expect("home");
    await intertest(app).get("/api/v1/user").expect("user");
    await intertest(app).get("/api/v2/item").expect("item");
    await intertest(app).get("/api/v2/book").expect("book");
    await intertest(app).get("/api/v2/name").expect("name");
    await intertest(app).get("/api/v2/hobby").expect("hobby");
  });
  await t.step("error handling", async () => {
    const app = nhttp();
    app.get("/", ({ noop }) => noop());
    app.get("/noop", async ({ noop }, next) => {
      try {
        await noop();
        return "success";
      } catch (error: TRet) {
        error.status = 400;
        return next(error);
      }
    });
    app.get("/noop2", async ({ noop }, next) => {
      try {
        await noop();
        return "success";
      } catch (error: TRet) {
        error.status = "400";
        return next(error);
      }
    });
    app.onError((err) => err.message);
    app.on404(() => "404");
    const noop = await app.fetch(myReq("GET", "/"), {});
    const noop2 = await app.fetch(myReq("GET", "/noop"));
    const noop3 = await app.fetch(myReq("GET", "/noop2"));
    const notFound = await app.fetch(myReq("GET", "/404"));
    assertEquals(await noop.text(), "noop is not a function");
    assertEquals(await notFound.text(), "404");
    assertEquals((await noop2).status, 400);
    assertEquals((await noop3).status, 500);
  });
  await t.step("error handling default", async () => {
    const app = nhttp();
    app.get("/", ({ noop }) => noop());
    app.get("/2", async ({ noop }) => await noop());
    const noop = await app.fetch(myReq("GET", "/"));
    const noop2 = await app.fetch(myReq("GET", "/2"));
    const notFound = await app.fetch(myReq("GET", "/404"));
    const message = (await noop.json()).message;
    const message2 = (await noop2.json()).message;
    const status = (await notFound.json()).status;
    assertEquals(message, "noop is not a function");
    assertEquals(message2, "noop is not a function");
    assertEquals(status, 404);
  });
  await t.step("error handling noop", async () => {
    const app = nhttp();
    app.get("/", ({ doo }) => doo());
    app.onError((rev) => {
      rev.noop();
    });
    app.on404((rev) => {
      rev.noop();
    });
    const noop = await app.fetch(myReq("GET", "/"));
    const noop2 = await app.fetch(myReq("GET", "/noop"));
    assertEquals((await noop.json()).message, "rev.noop is not a function");
    assertEquals((await noop2.json()).message, "rev.noop is not a function");
  });
  await t.step("query", async () => {
    const app = nhttp();
    app.get("/", (rev) => rev.query);
    await intertest(app).get("/?foo=bar").expect({ foo: "bar" });
  });
  await t.step("params", async () => {
    const app = nhttp();
    app.get("/:name", (rev) => rev.params);
    const val = await app.fetch(myReq("GET", "/john"));
    assertEquals(await val.text(), `{"name":"john"}`);
  });
  await t.step("onNext", async () => {
    const app = nhttp();
    app.use((_, next) => next());
    app.get("/", async (rev) => {
      await rev.foo();
      return "foo";
    });
    const res = await app.req("/").res();
    assertEquals(res.status, 500);
  });
  await t.step("undefined awaiter", async () => {
    const app = nhttp();
    app.get("/", (rev) => rev.undefined());
    const res = await app.req("/").res();
    assertEquals(res, undefined);
  });
  await t.step("onNext awaiter", async () => {
    const app = nhttp();
    app.use((_, next) => {
      return next();
    });
    app.get("/", (rev) => {
      setTimeout(() => {
        rev.send("foo");
      }, 100);
    });
    const res = await app.req("/").res();
    assertEquals(res.status, 200);
  });
  await t.step("awaiter", async () => {
    const app = nhttp();
    app.get("/", async (r) => {
      await Promise.resolve();
      setTimeout(() => {
        r.send("hello");
      }, 500);
    });
    app.get("/promise", (_rev) => {
      return Promise.resolve("hello");
    });
    const val = await app.fetch(myReq("GET", "/"));
    const promise = await app.fetch(myReq("GET", "/promise"));
    assertEquals(await val.text(), "hello");
    assertEquals(await promise.text(), "hello");
  });
  await t.step("mix use", async () => {
    const app = nhttp();
    app.use("/assets", () => "assets");
    app.get("/hello", () => "hello");
    app.get("/hey/*", () => "hey");
    app.get("*", () => "all");
    const assets = await app.fetch(myReq("GET", "/assets"));
    const all = await app.fetch(myReq("GET", "/"));
    const hello = await app.fetch(myReq("GET", "/hello/"));
    const hey = await app.fetch(myReq("GET", "/hey/hey"));
    assertEquals(await assets.text(), "assets");
    assertEquals(await all.text(), "all");
    assertEquals(await hello.text(), "hello");
    assertEquals(await hey.text(), "hey");
  });
  await t.step("oldSchool", () => {
    (Response as TRet).json = void 0;
    nhttp();
    const res = Response.json({ name: "john" });
    assertEquals(res.status, 200);
    const res2 = Response.json({ name: "john" }, {
      headers: { "name": "john" },
    });
    assertEquals(res2.headers.get("name"), "john");
    const res3 = Response.json({ name: "john" }, {
      headers: new Headers({ "name": "john" }),
    });
    assertEquals(res3.headers.get("name"), "john");
  });

  await t.step("without rev", async () => {
    const app = nhttp();
    app.get("/promise", () => Promise.resolve("hello"));
    app.get("/", () => "hello");
    app.get("/error", () => {
      throw "noop";
    });

    // deno-lint-ignore require-await
    app.get("/promise-error", async () => {
      throw "noop";
    });

    await app.req("/promise").text();
    const promise = await app.req("/promise").text();
    assertEquals(promise, "hello");

    await app.req("/").text();
    const index = await app.req("/").text();
    assertEquals(index, "hello");

    await app.req("/error").json();
    const err = await app.req("/error").json();
    assertEquals(typeof err, "object");

    await app.req("/promise-error").json();
    const err2 = await app.req("/promise-error").json();
    assertEquals(typeof err2, "object");

    app.onError((_, rev) => {
      setTimeout(() => {
        rev.send("err");
      });
    });

    await app.req("/error").text();
    const err3 = await app.req("/error").text();
    assertEquals(err3, "err");
  });
  await t.step("app.serve", () => {
    const app = nhttp();
    const mod = app.serve();
    assertEquals(typeof mod.fetch, "function");
  });
  await t.step("app.module", () => {
    const app = nhttp();
    const mod = app.module({
      fetch: () => new Response("home"),
    });
    assertEquals(typeof mod.fetch, "function");
  });
});
