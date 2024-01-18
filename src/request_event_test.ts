import { RequestEvent, toRes } from "./request_event.ts";
import { assertEquals } from "./deps_test.ts";
import { TRet } from "./types.ts";
import { HttpResponse } from "./http_response.ts";
import {
  s_body,
  s_cookies,
  s_file,
  s_headers,
  s_params,
  s_query,
  s_response,
  s_undefined,
} from "./symbol.ts";
import { nhttp } from "./nhttp.ts";

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

  rev.undefined();
  assertEquals(rev[s_undefined], true);
  rev[s_undefined] = void 0;
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

  assertEquals(rev.url, "/");
  rev.url = "/hello";
  assertEquals(rev.url, "/hello");

  assertEquals(rev.originalUrl, "/");
  rev.originalUrl = "/hello";
  assertEquals(rev.originalUrl, "/hello");

  assertEquals(rev.headers instanceof Headers, true);
  rev.headers = new Headers();
  assertEquals(rev[s_headers] instanceof Headers, true);

  assertEquals(typeof rev.responseInit, "object");
  await t.step("original url", () => {
    const rev = new RequestEvent({ url: "/" } as TRet);
    assertEquals(rev.originalUrl, "/");
  });
  await t.step("inspect", () => {
    const rev = new RequestEvent(new Request("http://127.0.0.1:8000/"));
    const key = Symbol.for("Deno.customInspect") as TRet;
    const inspect = rev[key].bind(rev);
    assertEquals(typeof inspect(Deno.inspect), "string");
  });
  await t.step("inspect2", () => {
    const rev = new RequestEvent(new Request("http://127.0.0.1:8000/"));
    rev.myvalue = "hello";
    const key = Symbol.for("Deno.customInspect") as TRet;
    const inspect = rev[key].bind(rev);
    assertEquals(typeof inspect(Deno.inspect), "string");
  });
  await t.step("inspect_node", () => {
    const rev = new RequestEvent(new Request("http://127.0.0.1:8000/"));
    const key = Symbol.for("nodejs.util.inspect.custom") as TRet;
    const inspect = rev[key].bind(rev);
    const fn = (val: TRet) => val.toString();
    assertEquals(typeof inspect(2, {}, fn), "string");
    assertEquals(typeof inspect(2, {}), "string");
  });
  await t.step("inspect2_node", () => {
    const rev = new RequestEvent(new Request("http://127.0.0.1:8000/"));
    rev.myvalue = "hello";
    const key = Symbol.for("nodejs.util.inspect.custom") as TRet;
    const inspect = rev[key].bind(rev);
    const fn = (val: TRet) => val.toString();
    assertEquals(typeof inspect(2, {}, fn), "string");
    assertEquals(typeof inspect(2, {}), "string");
  });
  await t.step("miss req", () => {
    const req = new Request("http://127.0.0.1:8000/");
    req._info = { conn: {}, ctx: {} };
    const rev = new RequestEvent(req);
    assertEquals(typeof rev.info.conn, "object");
    assertEquals(typeof rev.info.context, "object");
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
  await t.step("waitUntil2", () => {
    const req = new Request("http://127.0.0.1:8000/");
    req._info = {
      conn: void 0,
      ctx: {
        waitUntil: (promise: Promise<TRet>) => {
          promise.catch(console.error);
        },
      },
    };
    const rev = new RequestEvent(req);
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

  await t.step("toRes", () => {
    const myRes = (arr: TRet[]) => {
      for (let i = 0; i < arr.length; i++) {
        const val = arr[i];
        const res = toRes(val);
        assertEquals(res instanceof Response, true);
      }
    };
    myRes([
      "str",
      { name: "john" },
      123,
      null,
      new Response(""),
      false,
      new Uint8Array(),
      new ReadableStream(),
      new Blob(["hello"]),
    ]);
    const res = toRes(undefined);
    assertEquals(res instanceof Response, false);
  });

  await t.step("requestEvent and newRequest", async () => {
    const rev = new RequestEvent(
      new Request("http://127.0.0.1:8000/"),
    );
    assertEquals(rev.requestEvent() instanceof RequestEvent, true);
    assertEquals(rev.newRequest instanceof Request, true);

    const app = nhttp();

    app.post("/json", async (rev) => {
      const req = rev.newRequest;
      const json = await req.json();
      assertEquals(typeof json === "object", true);
      return "success";
    });

    app.post("/form", async (rev) => {
      const req = rev.newRequest;
      const form = await req.formData();
      assertEquals(form instanceof FormData, true);
      return "success";
    });

    const json = await app.req("/json", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: "john" }),
    }).text();
    assertEquals(json, "success");

    const form = await app.req("/form", {
      method: "POST",
      body: new FormData(),
    }).text();
    assertEquals(form, "success");
  });
});
