import { JsonResponse } from "./http_response.ts";
import { assertEquals } from "./deps_test.ts";
import { TRet } from "./types.ts";
import { HTML_TYPE, JSON_TYPE } from "./constant.ts";
import { s_params } from "./symbol.ts";
import { RequestEvent } from "./request_event.ts";

function buildRes(config = {}) {
  const rev = new RequestEvent(new Request("http://127.0.0.1:8000/", config));
  return rev.response;
}

Deno.test("HttpResponse", async (t) => {
  await t.step("JsonResponse", async (t) => {
    const type = "content-type";
    await t.step("without resInit", () => {
      const resp = new JsonResponse({});
      assertEquals(resp.headers.get(type), JSON_TYPE);
    });
    await t.step("with resInit", () => {
      const resp = new JsonResponse({}, { headers: { name: "john" } });
      assertEquals(resp.headers.get(type), JSON_TYPE);
      assertEquals(resp.headers.get("name"), "john");
    });
    await t.step("with resInit Headers", () => {
      const resp = new JsonResponse({}, {
        headers: new Headers({ name: "john" }),
      });
      assertEquals(resp.headers.get(type), JSON_TYPE);
      assertEquals(resp.headers.get("name"), "john");
    });
    await t.step("bigint", async () => {
      const resp = new JsonResponse({ int: BigInt(9007199254740991) });
      assertEquals(await resp.json(), { "int": "9007199254740991" });
    });
  });
  await t.step("response", async (t) => {
    await t.step("header", () => {
      const response = buildRes();
      assertEquals(response.header().toJSON(), {});
      response.header("name", "john");
      response.header({ "address": "jakarta" });
      const header = response.header().toJSON();
      assertEquals(header["name"], "john");
      assertEquals(header["address"], "jakarta");
    });
    await t.step("status", () => {
      const response = buildRes();
      response.status(201);
      assertEquals(response.status(), 201);

      response.status(201);
      (response.init as TRet).status = void 0;
      assertEquals(response.status(), 200);
    });
    await t.step("type", () => {
      const response = buildRes();
      response.type("text/html");
      assertEquals(response.header("content-type") as string, "text/html");
    });
    await t.step("json", () => {
      const response = buildRes();
      response.json({ name: "john" });
      assertEquals(response.statusCode, 200);
    });
    await t.step("html", () => {
      const response = buildRes();
      response.html("<h1>hello</h1>");
      assertEquals(response.getHeader("content-type"), HTML_TYPE);
    });
    await t.step("cookie", () => {
      const response = buildRes();
      response.cookie("name", "john", { httpOnly: true });
      assertEquals(typeof response.header("Set-Cookie"), "string");
      response.clearCookie("fname", { httpOnly: true });

      response.cookie("name", "john", { path: "/", maxAge: 1000 });
      assertEquals(typeof response.header("Set-Cookie"), "string");
      response.clearCookie("name");

      response.cookie("name", ["john", "doe"]);
      assertEquals(typeof response.header("Set-Cookie"), "string");
      response.clearCookie("name");
    });
    await t.step("redirect", () => {
      const response = buildRes();
      response.redirect("/hello");
      assertEquals(response.header("Location") as string, "/hello");

      response.redirect("/hello", 302);
      assertEquals(response.status() as number, 302);
    });
    await t.step("sendStatus", () => {
      const response = buildRes();
      response.sendStatus(201);
      assertEquals(response.statusCode, 201);
    });
    await t.step("statusCode", () => {
      const response = buildRes();
      response.statusCode = 201;
      const status = response.statusCode;
      assertEquals(status, 201);
    });
    await t.step("send", () => {
      const response = buildRes();
      response.send("hello");
      assertEquals(response.statusCode, 200);
    });
    await t.step("set/get header", () => {
      const response = buildRes();
      response.setHeader("key", "value");
      assertEquals(response.getHeader("key"), "value");
    });
    await t.step("toJSON header", () => {
      const response = buildRes();
      response.setHeader("key", "value");
      assertEquals(response.header().toJSON(), { key: "value" });
    });
    await t.step("attachment", () => {
      const response = buildRes();
      response.attachment();
      assertEquals(response.header("content-disposition"), "attachment;");
      response.attachment("my_file.txt");
      assertEquals(
        response.header("content-disposition"),
        "attachment; filename=my_file.txt",
      );
    });
    await t.step("params", () => {
      const response = buildRes();
      assertEquals(response.params, {});
      assertEquals(response[s_params], {});
      response.params = { obj: {} };
      response.params.name = "john";
      assertEquals(response.params, { obj: {}, name: "john" });
    });

    await t.step("inspect", () => {
      const response = buildRes();
      const key = Symbol.for("Deno.customInspect") as TRet;
      const inspect = response[key].bind(response);
      assertEquals(typeof inspect(Deno.inspect), "string");
    });
    await t.step("inspect 2", () => {
      const response = buildRes();
      response.myvalue = "hello";
      const key = Symbol.for("Deno.customInspect") as TRet;
      const inspect = response[key].bind(response);
      assertEquals(typeof inspect(Deno.inspect), "string");
    });
    await t.step("inspect_node", () => {
      const response = buildRes();
      const key = Symbol.for("nodejs.util.inspect.custom") as TRet;
      const inspect = response[key].bind(response);
      const fn = (val: TRet) => val.toString();
      assertEquals(typeof inspect(2, {}, fn), "string");
      assertEquals(typeof inspect(2, {}), "string");
    });
    await t.step("inspect2_node", () => {
      const response = buildRes();
      response.myvalue = "hello";
      const key = Symbol.for("nodejs.util.inspect.custom") as TRet;
      const inspect = response[key].bind(response);
      const fn = (val: TRet) => val.toString();
      assertEquals(typeof inspect(2, {}, fn), "string");
      assertEquals(typeof inspect(2, {}), "string");
    });
  });
});
