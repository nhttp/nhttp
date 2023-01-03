import { RequestEvent } from "./request_event.ts";
import { assertEquals } from "./deps_test.ts";

Deno.test("RequestEvent", () => {
  const rev = new RequestEvent(new Request("http://127.0.0.1:8000/"));
  const names = [
    "_info",
    "_ctx",
    "__params",
  ];
  names.forEach((name) => {
    assertEquals(typeof rev[name], "undefined");
  });

  assertEquals(rev.search, null);

  assertEquals(rev.responseInit, {
    headers: new Headers(),
    status: 200,
    statusText: "OK",
  });
  rev.response.init = { headers: new Headers() };
  assertEquals(rev.responseInit, {
    headers: new Headers(),
    status: 200,
    statusText: "OK",
  });
  assertEquals(rev.file, {});
  assertEquals(rev["_file"], {});
  rev.file = { obj: {} };
  rev.file.name = "john";
  assertEquals(rev.file, { obj: {}, name: "john" });

  assertEquals(rev.body, {});
  assertEquals(rev["_body"], {});
  rev.body = { obj: {} };
  rev.body.name = "john";
  assertEquals(rev.body, { obj: {}, name: "john" });

  assertEquals(rev.query, {});
  assertEquals(rev["_query"], {});
  rev.query = { obj: {} };
  rev.query.name = "john";
  assertEquals(rev.query, { obj: {}, name: "john" });

  assertEquals(rev.params, {});
  assertEquals(rev["_params"], {});
  rev.params = { obj: {} };
  rev.params.name = "john";
  assertEquals(rev.params, { obj: {}, name: "john" });

  assertEquals(rev.cookies, {});
  assertEquals(rev["_cookies"], {});
  rev.cookies = { obj: {} };
  rev.cookies.name = "john";
  assertEquals(rev.cookies, { obj: {}, name: "john" });

  assertEquals(rev.info, {});
  assertEquals(rev["_info"], {});
  rev.info.name = "john";
  assertEquals(rev.info, { name: "john" });

  assertEquals(rev.context, {});
  assertEquals(rev["_ctx"], {});
  rev.context.name = "john";
  assertEquals(rev.context, { name: "john" });

  assertEquals(rev.method, "GET");
  assertEquals(rev["_method"], "GET");
  rev.method = "POST";
  assertEquals(rev.method, "POST");

  assertEquals(rev.originalUrl, "/");

  const resp = rev.resp("hello", { status: 200 });
  assertEquals(resp instanceof Response, true);
  assertEquals(rev.c_res instanceof Response, true);
});
