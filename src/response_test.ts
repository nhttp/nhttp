import { assertEquals } from "./deps_test.ts";
import { initMyRes } from "./response.ts";
import { TRet } from "./types.ts";

Deno.test("response", () => {
  initMyRes();
  const res = new Response("hi");
  assertEquals(res.status, 200);
  assertEquals(res.ok, true);
  assertEquals(res.redirected, false);
  assertEquals(res.bodyUsed, false);
  assertEquals(new Response("hi").body instanceof ReadableStream, true);
  assertEquals(new Response("hi").text() instanceof Promise, true);
  assertEquals(
    new Response(`{"name": "john"}`).json() instanceof Promise,
    true,
  );
  assertEquals(new Response("hi").arrayBuffer() instanceof Promise, true);
  assertEquals(new Response("hi").blob() instanceof Promise, true);
  assertEquals(
    new Response(new FormData()).formData() instanceof Promise,
    true,
  );
  assertEquals(res.statusText, "");
  assertEquals(res.url, "");
  assertEquals(res.type, "default");
  assertEquals(res.headers instanceof Headers, true);
  assertEquals(typeof res.clone(), "object");
  assertEquals(typeof Response.json({ name: "john" }), "object");
  assertEquals(
    typeof Response.json({ name: "john" }, { status: 201 }),
    "object",
  );
  assertEquals(typeof Response.error(), "object");
  assertEquals(
    typeof Response.redirect("http://localhost:8000/hello"),
    "object",
  );
  assertEquals(
    typeof Response.redirect("http://localhost:8000/hello", 301),
    "object",
  );
  const key = Symbol.for("Deno.customInspect") as TRet;
  const inspect = (res as TRet)[key].bind(res);
  assertEquals(typeof inspect(Deno.inspect), "string");
  // release the Response
  globalThis.Response = globalThis.NativeResponse;
});
