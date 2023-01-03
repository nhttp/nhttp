import {
  HttpResponse,
  JSON_TYPE_CHARSET,
  JsonResponse,
} from "./http_response.ts";
import { assertEquals } from "./deps_test.ts";
import { TRet } from "./types.ts";

Deno.test("HttpResponse", async (t) => {
  await t.step("JsonResponse", async (t) => {
    const type = "content-type";
    await t.step("without resInit", () => {
      const resp = new JsonResponse({});
      assertEquals(resp.headers.get(type), JSON_TYPE_CHARSET);
    });
    await t.step("with resInit", () => {
      const resp = new JsonResponse({}, { headers: { name: "john" } });
      assertEquals(resp.headers.get(type), JSON_TYPE_CHARSET);
      assertEquals(resp.headers.get("name"), "john");
    });
    await t.step("with resInit Headers", () => {
      const resp = new JsonResponse({}, {
        headers: new Headers({ name: "john" }),
      });
      assertEquals(resp.headers.get(type), JSON_TYPE_CHARSET);
      assertEquals(resp.headers.get("name"), "john");
    });
  });
  await t.step("response", async (t) => {
    const res = new HttpResponse(
      (r, init) => new Response(r, init),
      new Request("http://127.0.0.1:8000/"),
    );
    await t.step("header", () => {
      res.header("name", "john");
      res.header({ "address": "jakarta" });
      res.header(new Headers({ "gender": "male" }));
      const header = res.header();
      assertEquals(header.get("name"), "john");
      assertEquals(header.get("address"), "jakarta");
      const gender = res.header("gender") as string;
      assertEquals(gender, "male");
    });
    await t.step("status", () => {
      res.status(201);
      assertEquals(res.status(), 201);

      res.status(201);
      (res.init as TRet).status = void 0;
      assertEquals(res.status(), 200);
    });
    await t.step("type", () => {
      res.type("text/html");
      assertEquals(res.header("content-type") as string, "text/html");
    });
    await t.step("json", async () => {
      const json = res.json({ name: "john" }) as Response;
      assertEquals(await json.text(), `{"name":"john"}`);
    });
    await t.step("json no init", async () => {
      res.init = void 0;
      const json = res.json({ name: "john" }) as Response;
      assertEquals(await json.text(), `{"name":"john"}`);
    });
    await t.step("cookie", () => {
      res.cookie("name", "john", { httpOnly: true });
      assertEquals(res.header().has("Set-Cookie"), true);
      res.clearCookie("fname", { httpOnly: true });

      res.cookie("name", "john", { path: "/", maxAge: 1000 });
      assertEquals(res.header().has("Set-Cookie"), true);
      res.clearCookie("name");

      res.cookie("name", ["john", "doe"]);
      assertEquals(res.header().has("Set-Cookie"), true);
      res.clearCookie("name");
    });
    await t.step("redirect", () => {
      res.redirect("/hello");
      assertEquals(res.header("Location") as string, "/hello");

      res.redirect("/hello", 302);
      assertEquals(res.status() as number, 302);
    });
    await t.step("sendStatus", async () => {
      const resp = res.sendStatus(201) as Response;
      assertEquals(await resp.text(), "Created");
      assertEquals(resp.status, 201);
    });
    await t.step("statusCode", () => {
      res.statusCode = 201;
      const status = res.statusCode;
      assertEquals(status, 201);
    });
    await t.step("send", async () => {
      const text = `{"name":"john"}`;
      const response = res.send(new Response(text)) as Response;
      const str = res.send(text) as Response;
      const json = res.send(JSON.parse(text)) as Response;
      const strs = await Promise.all<string>([
        response.text(),
        str.text(),
        json.text(),
      ]);
      for (let i = 0; i < strs.length; i++) {
        assertEquals(strs[i], text);
      }
      const numb = res.send(123 as TRet) as Response;
      assertEquals(await numb.text(), "123");

      const uint = res.send(new Uint8Array()) as Response;
      assertEquals(typeof uint.body, "object");

      const readable = res.send(new ReadableStream()) as Response;
      assertEquals(typeof readable.body, "object");

      const form = res.send(new FormData()) as Response;
      assertEquals(typeof form.body, "object");

      const blob = res.send(new Blob()) as Response;
      assertEquals(typeof blob.body, "object");

      const read = res.send({ read: () => {} }) as Response;
      assertEquals(typeof read.body, "object");
    });

    await t.step("headers", () => {
      const res = new HttpResponse(
        (r, init) => new Response(r, init),
        new Request("http://127.0.0.1:8000/"),
      );
      res.headers.set("key", "value");
      assertEquals(res.headers.get("key"), "value");
      res.init = undefined;
      res.headers = new Headers();
      assertEquals(res.headers instanceof Headers, true);
    });

    await t.step("sendFile", async () => {
      const res = new HttpResponse(
        (r, init) => new Response(r, init),
        new Request("http://127.0.0.1:8000/"),
      );
      const ret = await res.sendFile("dummy/test.txt") as Response;
      assertEquals(ret.status, 200);
    });
    await t.step("sendFile 404", async () => {
      const res = new HttpResponse(
        (r, init) => new Response(r, init),
        new Request("http://127.0.0.1:8000/"),
      );
      try {
        await res.sendFile("dummy.txt") as Response;
      } catch (error) {
        assertEquals(error.status, 404);
      }
    });
    await t.step("sendFile etag", async () => {
      const stat = await Deno.stat("dummy/test.txt");
      const etag = `W/"${stat.size}-${stat.mtime?.getTime()}"`;
      const res = new HttpResponse(
        (r, init) => new Response(r, init),
        new Request("http://127.0.0.1:8000/", {
          headers: {
            "if-none-match": etag,
          },
        }),
      );
      const ret = await res.sendFile("dummy/test.txt") as Response;
      assertEquals(ret.status, 304);
    });
    await t.step("download", async () => {
      const res = new HttpResponse(
        (r, init) => new Response(r, init),
        new Request("http://127.0.0.1:8000/"),
      );
      const ret = await res.download("dummy/test.txt") as Response;
      assertEquals(ret.status, 200);
    });
    await t.step("download 404", async () => {
      const res = new HttpResponse(
        (r, init) => new Response(r, init),
        new Request("http://127.0.0.1:8000/"),
      );
      try {
        await res.download("dummy.txt") as Response;
      } catch (error) {
        assertEquals(error.status, 404);
      }
    });
    await t.step("download etag", async () => {
      const stat = await Deno.stat("dummy/test.txt");
      const etag = `W/"${stat.size}-${stat.mtime?.getTime()}"`;
      const res = new HttpResponse(
        (r, init) => new Response(r, init),
        new Request("http://127.0.0.1:8000/", {
          headers: {
            "if-none-match": etag,
          },
        }),
      );
      const ret = await res.download("dummy/test.txt") as Response;
      assertEquals(ret.status, 304);
    });
    await t.step("set/get header", () => {
      const res = new HttpResponse(
        (r, init) => new Response(r, init),
        new Request("http://127.0.0.1:8000/"),
      );
      res.setHeader("key", "value");
      assertEquals(res.getHeader("key"), "value");
    });
  });
});
