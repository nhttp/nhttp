import { acceptContentType, bodyParser } from "./body.ts";
import { assertEquals } from "./deps_test.ts";
import { RequestEvent } from "./request_event.ts";
import { TRet } from "./types.ts";
import { encoder } from "./utils.ts";
const base = "http://127.0.0.1:8000";
Deno.test("body parser", async (t) => {
  const request = (
    content: string | FormData,
    type: string,
    lose?: boolean,
    lose2?: boolean,
    method = "POST",
  ) => ({
    [lose ? "noop" : "formData"]: () => lose2 ? new Error("noop") : content,
    arrayBuffer: () => encoder.encode(content as string),
    method,
    headers: new Headers({ "content-type": type }),
    bodyUsed: false,
    body: "noop",
    url: base + "/",
  });
  await t.step("content-type", async (t) => {
    const createBody = async (
      content: string | FormData,
      type: string,
      lose?: boolean,
      lose2?: boolean,
    ) => {
      const rev = new RequestEvent(request(content, type, lose, lose2) as TRet);
      await bodyParser()(rev, (err?: Error) => err?.message || "noop");
      return rev.body;
    };
    await t.step("content-type json", async () => {
      const ret = await createBody(`{"name": "john"}`, "application/json");
      assertEquals(ret, { "name": "john" });
    });
    await t.step("content-type urlencoded", async () => {
      const ret = await createBody(
        `name=john`,
        "application/x-www-form-urlencoded",
      );
      assertEquals(ret, { "name": "john" });
    });
    await t.step("content-type multipart", async () => {
      const form = new FormData();
      form.set("name", "john");
      const ret = await createBody(
        form,
        "multipart/form-data",
      );
      assertEquals(ret, { "name": "john" });
    });
    await t.step("content-type multipart no request.formData", async () => {
      const form = new FormData();
      form.set("name", "john");
      const ret = await createBody(
        form,
        "multipart/form-data",
        true,
      );
      assertEquals(ret, {});
    });
    await t.step("content-type multipart error try/catch", async () => {
      const form = new FormData();
      form.set("name", "john");
      const ret = await createBody(
        form,
        "multipart/form-data",
        false,
        true,
      );
      assertEquals(ret, {});
    });
    await t.step("content-type raw", async () => {
      const ret = await createBody(`{"name": "john"}`, "text/plain");
      assertEquals(ret, { "name": "john" });
    });
    await t.step("content-type raw not json", async () => {
      const ret = await createBody(`my name john`, "text/plain");
      assertEquals(ret, { "_raw": "my name john" });
    });
  });

  await t.step("body disable", async (t) => {
    await t.step("disable value 0", async (t) => {
      const createBody = async (content: string | FormData, type: string) => {
        const rev = new RequestEvent(request(content, type) as TRet);
        await bodyParser({
          json: 0,
          urlencoded: 0,
          raw: 0,
          multipart: 0,
        })(rev, (err?: Error) => err?.message || "noop");
        return rev.body;
      };
      await t.step("disable value 0 json", async () => {
        const ret = await createBody(`{"name": "john"}`, "application/json");
        assertEquals(ret, {});
      });
      await t.step("disable value 0 urlencoded", async () => {
        const ret = await createBody(
          `name=john`,
          "application/x-www-form-urlencoded",
        );
        assertEquals(ret, {});
      });
      await t.step("disable value 0 raw", async () => {
        const ret = await createBody(`{"name": "john"}`, "text/plain");
        assertEquals(ret, {});
      });
      await t.step("disable value 0 multipart", async () => {
        const form = new FormData();
        form.set("name", "john");
        const ret = await createBody(
          form,
          "multipart/form-data",
        );
        assertEquals(ret, {});
      });
    });
    await t.step("disable value false", async (t) => {
      const createBody = async (content: string | FormData, type: string) => {
        const rev = new RequestEvent(request(content, type) as TRet);
        await bodyParser({
          json: false,
          urlencoded: false,
          raw: false,
          multipart: false,
        })(rev, (err?: Error) => err?.message || "noop");
        return rev.body;
      };

      await t.step("disable value false json", async () => {
        const ret = await createBody(`{"name": "john"}`, "application/json");
        assertEquals(ret, {});
      });
      await t.step("disable value false urlencoded", async () => {
        const ret = await createBody(
          `name=john`,
          "application/x-www-form-urlencoded",
        );
        assertEquals(ret, {});
      });
      await t.step("disable value false raw", async () => {
        const ret = await createBody(`{"name": "john"}`, "text/plain");
        assertEquals(ret, {});
      });
      await t.step("disable value false not json", async () => {
        const ret = await createBody(`my name john`, "text/plain");
        assertEquals(ret, {});
      });
      await t.step("disable value false multipart", async () => {
        const form = new FormData();
        form.set("name", "john");
        const ret = await createBody(
          form,
          "multipart/form-data",
        );
        assertEquals(ret, {});
      });
    });
  });
  await t.step("verify body", async (t) => {
    const createBody = async (content: string | FormData, type: string) => {
      const rev = new RequestEvent(request(content, type) as TRet);
      return await bodyParser({
        json: 1,
        raw: 1,
        urlencoded: 1,
      })(rev, (err?: Error) => err?.message || "noop");
    };
    const errMessage = "Body is too large. max limit 1";
    await t.step("verify json", async () => {
      const ret = await createBody(`{"name": "john"}`, "application/json");
      assertEquals(ret, errMessage);
    });
    await t.step("verify urlencoded", async () => {
      const ret = await createBody(
        `name=john`,
        "application/x-www-form-urlencoded",
      );
      assertEquals(ret, errMessage);
    });
    await t.step("verify raw", async () => {
      const ret = await createBody(`{"name": "john"}`, "text/plain");
      assertEquals(ret, errMessage);
    });
    await t.step("verify raw not json", async () => {
      const ret = await createBody(`my name john`, "text/plain");
      assertEquals(ret, errMessage);
    });
  });
  await t.step("GET body", async () => {
    const createBody = async (
      type: string,
    ) => {
      const rev = new RequestEvent(
        new Request(base + "/", {
          method: "GET",
          headers: { "content-type": type },
        }),
      );
      await bodyParser()(rev, (err?: Error) => err?.message || "noop");
      return rev.body;
    };
    const ret = await createBody("application/json");
    assertEquals(ret, {});
    const ret2 = await createBody("application/x-www-form-urlencoded");
    assertEquals(ret2, {});
    const ret3 = await createBody("text/plain");
    assertEquals(ret3, {});
  });
  await t.step("false and cosume", async () => {
    const req = new Request(base + "/", {
      method: "GET",
      headers: { "content-type": "application/json" },
    });
    const createBody = async (status: boolean) => {
      const rev = new RequestEvent(req);
      await bodyParser(status)(rev, (err?: Error) => err?.message || "noop");
      return rev.body;
    };
    const ret = await createBody(false);
    assertEquals(ret, {});
    const ret2 = await createBody(true);
    assertEquals(ret2, {});
  });
  await t.step("acceptContentType", () => {
    const isAccept = acceptContentType(
      { "content-type": "noop" } as TRet,
      "application/json",
    );
    assertEquals(isAccept, false);
  });
});
