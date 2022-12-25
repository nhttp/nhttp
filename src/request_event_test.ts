import { RequestEvent } from "./request_event.ts";
import { assertEquals } from "./deps_test.ts";

Deno.test("RequestEvent", () => {
  const rev = new RequestEvent(new Request("http://x.x/"));
  const names = [
    "conn",
    "info",
    "respondWith",
    "search",
    "_path",
    "_url",
    "_query",
    "_body",
    "_file",
    "_cookies",
    "res",
    "getCookies",
  ];
  names.forEach((name) => {
    assertEquals(typeof rev[name], "undefined");
  });

  assertEquals(rev.cookies, {});

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

  assertEquals(rev.originalUrl, "/");
});
