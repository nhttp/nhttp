import { RequestEvent } from "./request_event.ts";
import { assertEquals } from "./deps_test.ts";
import { TRet } from "./types.ts";
import { HttpResponse } from "./http_response.ts";
import { ROUTE } from "./constant.ts";
import { toPathx } from "./utils.ts";
import {
  s_body,
  s_cookies,
  s_file,
  s_headers,
  s_params,
  s_query,
  s_response,
  s_route,
} from "./symbol.ts";

Deno.test("RequestEvent", async (t) => {
  const rev = new RequestEvent(new Request("http://127.0.0.1:8000/"));
  const names = [
    "_info",
    "_ctx",
  ];
  names.forEach((name) => {
    assertEquals(typeof rev[name], "undefined");
  });

  assertEquals(typeof rev.info, "object");
  rev.send(0);
  assertEquals(rev[s_response] instanceof Response, true);
  rev.respondWith(new Response(""));
  assertEquals(rev[s_response] instanceof Response, true);
  assertEquals(rev.response instanceof HttpResponse, true);

  assertEquals(rev.file, {});
  assertEquals(rev[s_file], {});
  rev.file = { obj: {} };
  rev.file.name = "john";
  assertEquals(rev.file, { obj: {}, name: "john" });

  assertEquals(rev.body, {});
  assertEquals(rev[s_body], {});
  rev.body = { obj: {} };
  rev.body.name = "john";
  assertEquals(rev.body, { obj: {}, name: "john" });

  assertEquals(rev.query, {});
  assertEquals(rev[s_query], {});
  rev.query = { obj: {} };
  rev.query.name = "john";
  assertEquals(rev.query, { obj: {}, name: "john" });

  assertEquals(rev.params, {});
  assertEquals(rev[s_params], {});
  rev.params = { obj: {} };
  rev.params.name = "john";
  assertEquals(rev.params, { obj: {}, name: "john" });

  assertEquals(rev.cookies, {});
  assertEquals(rev[s_cookies], {});
  rev.cookies = { obj: {} };
  rev.cookies.name = "john";
  assertEquals(rev.cookies, { obj: {}, name: "john" });

  assertEquals(rev.method, "GET");
  rev.method = "POST";
  assertEquals(rev.method, "POST");

  assertEquals(rev.search, null);
  assertEquals(rev.bodyUsed, false);
  rev.bodyUsed = true;
  assertEquals(rev.bodyUsed, true);

  assertEquals(rev.url, "/");
  rev.url = "/hello";
  assertEquals(rev.url, "/hello");

  assertEquals(rev.originalUrl, "/");
  assertEquals(rev.headers instanceof Headers, true);
  rev.headers = new Headers();
  assertEquals(rev[s_headers] instanceof Headers, true);

  assertEquals(typeof rev.responseInit, "object");
  await t.step("original url", () => {
    const rev = new RequestEvent({ url: "/" } as TRet);
    assertEquals(rev.originalUrl, "/");
  });
  await t.step("bodyValid", () => {
    const rev = new RequestEvent({ url: "/" } as TRet);
    assertEquals(rev.bodyValid, true);
    const rev2 = new RequestEvent({ url: "http://x.x", body: null } as TRet);
    assertEquals(rev2.bodyValid, false);
  });
  await t.step("rev.route", () => {
    const base = "http://127.0.0.1:8000";
    const arr = [
      {
        path: "/hello",
      },
      {
        path: "/hello/:name",
        ...toPathx("/hello/:name"),
      },
    ];
    ROUTE["GET"] = arr;
    const rev = new RequestEvent(new Request(base + "/hello"));
    assertEquals(rev.route.path, "/hello");
    const rev2 = new RequestEvent(new Request(base + "/hello/john"));
    assertEquals(rev2.route.path, "/hello/:name");
    const rev3 = new RequestEvent(new Request(base + "/hello/"));
    assertEquals(rev3.route.path, "/hello");
    const rev4 = new RequestEvent(new Request(base + "/hello/test"));
    rev4[s_route] = {};
    assertEquals(rev4.route, {} as TRet);
  });
  await t.step("inspect", () => {
    const rev = new RequestEvent(new Request("http://127.0.0.1:8000/"));
    const key = Symbol.for("Deno.customInspect") as TRet;
    const inspect = rev[key].bind(rev);
    assertEquals(typeof inspect(Deno.inspect), "string");
  });
  await t.step("miss res", () => {
    const rev = new RequestEvent(
      new Request("http://127.0.0.1:8000/"),
      {},
      () => ({}),
    );
    assertEquals(rev.response as TRet, {});
    assertEquals(typeof rev.info, "object");
  });
  await t.step("miss req", () => {
    const rev = new RequestEvent(
      { url: "/" } as TRet,
      {},
      () => ({}),
    );
    assertEquals(typeof rev.request, "object");
    assertEquals(rev.bodyUsed, false);
  });
  await t.step("waitUntil", () => {
    const rev = new RequestEvent(
      new Request("http://127.0.0.1:8000/"),
    );
    const val = Promise.resolve("hay");
    const val2 = "hay";
    rev.waitUntil(val);
    assertEquals(val instanceof Promise, true);
    try {
      rev.waitUntil(val2 as TRet);
    } catch (error) {
      assertEquals(error.status, 500);
    }
  });
});
