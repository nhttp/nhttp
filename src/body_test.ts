import { bodyParser, getType } from "./body.ts";
import { C_TYPE, JSON_TYPE } from "./constant.ts";
import { assertEquals } from "./deps_test.ts";
import type { TApp } from "./index.ts";
import { nhttp } from "./nhttp.ts";
import type { TBodyParser, TRet } from "./types.ts";

Deno.test("body parser", async (t) => {
  const getBody = (body: TRet, type?: string, opts?: TApp) => {
    const app = nhttp(opts);
    app.post("/", (rev) => rev.body);
    return app.req("/", {
      method: "POST",
      headers: type ? { [C_TYPE]: type } : void 0,
      body,
    }).json();
  };
  await t.step("content-type", async (t) => {
    await t.step("content-type noop", async () => {
      const ret = await getBody(
        `{"name": "john"`,
        "application/noop",
      );
      assertEquals(ret, {});
    });
    await t.step("content-type json", async () => {
      const ret = await getBody(
        `{"name": "john"}`,
        "application/json; charset=utf-8",
      );
      assertEquals(ret, { "name": "john" });
      const ret2 = await getBody(
        `{"name": "john"}`,
        "application/json",
        { bodyParser: { json: "1mb" } },
      );
      assertEquals(ret2, { "name": "john" });
    });
    await t.step("content-type urlencoded", async () => {
      const ret = await getBody(
        `name=john`,
        "application/x-www-form-urlencoded",
      );
      assertEquals(ret, { "name": "john" });
    });
    await t.step("content-type multipart", async () => {
      const form = new FormData();
      form.set("name", "john");
      const ret = await getBody(form);
      assertEquals(ret, { "name": "john" });
    });
    await t.step("content-type raw", async () => {
      const ret = await getBody(`{"name": "john"}`, "text/plain");
      assertEquals(ret, { "name": "john" });
    });
    await t.step("content-type raw not json", async () => {
      const ret = await getBody(`my name john`, "text/plain");
      assertEquals(ret, { "_raw": "my name john" });
    });
  });

  await t.step("body disable", async (t) => {
    await t.step("disable value 0", async (t) => {
      await t.step("disable value 0 json", async () => {
        const ret = await getBody(`{"name": "john"}`, "application/json", {
          bodyParser: { json: 0 },
        });
        assertEquals(ret, {});
      });
      await t.step("disable value 0 urlencoded", async () => {
        const ret = await getBody(
          `name=john`,
          "application/x-www-form-urlencoded",
          { bodyParser: { urlencoded: 0 } },
        );
        assertEquals(ret, {});
      });
      await t.step("disable value 0 raw", async () => {
        const ret = await getBody(`{"name": "john"}`, "text/plain", {
          bodyParser: { raw: 0 },
        });
        assertEquals(ret, {});
      });
      await t.step("disable value 0 multipart", async () => {
        const form = new FormData();
        form.set("name", "john");
        const ret = await getBody(
          form,
          "multipart/form-data",
          { bodyParser: { multipart: 0 } },
        );
        assertEquals(ret, {});
      });
    });
    await t.step("disable value false", async (t) => {
      await t.step("disable value false json", async () => {
        const ret = await getBody(`{"name": "john"}`, "application/json", {
          bodyParser: { json: false },
        });
        assertEquals(ret, {});
      });
      await t.step("disable value false urlencoded", async () => {
        const ret = await getBody(
          `name=john`,
          "application/x-www-form-urlencoded",
          { bodyParser: { urlencoded: false } },
        );
        assertEquals(ret, {});
      });
      await t.step("disable value false raw", async () => {
        const ret = await getBody(`{"name": "john"}`, "text/plain", {
          bodyParser: { raw: false },
        });
        assertEquals(ret, {});
      });
      await t.step("disable value false multipart", async () => {
        const form = new FormData();
        form.set("name", "john");
        const ret = await getBody(
          form,
          "multipart/form-data",
          { bodyParser: { multipart: false } },
        );
        assertEquals(ret, {});
      });
    });
  });
  await t.step("verify body", async (t) => {
    await t.step("verify json", async () => {
      const ret = await getBody(`{"name": "john"}`, "application/json", {
        bodyParser: { json: 1 },
      });
      assertEquals(ret.status, 400);
    });
    await t.step("verify urlencoded", async () => {
      const ret = await getBody(
        `name=john`,
        "application/x-www-form-urlencoded",
        { bodyParser: { urlencoded: 1 } },
      );
      assertEquals(ret.status, 400);
    });
    await t.step("verify raw", async () => {
      const ret = await getBody(`{"name": "john"}`, "text/plain", {
        bodyParser: { raw: 1 },
      });
      assertEquals(ret.status, 400);
    });
    await t.step("verify raw not json", async () => {
      const ret = await getBody(`my name john`, "text/plain", {
        bodyParser: { raw: 1 },
      });
      assertEquals(ret.status, 400);
    });
  });
  await t.step("middleware bodyParser", async (t) => {
    const getMiddBody = (
      body: TRet,
      type?: string,
      opts?: TBodyParser | boolean,
      optsApp?: TApp,
    ) => {
      const app = nhttp(optsApp);
      app.post("/", bodyParser(opts), (rev) => rev.body);
      return app.req("/", {
        method: "POST",
        headers: type ? { [C_TYPE]: type } : void 0,
        body,
      }).json();
    };
    await t.step("verify", async (t) => {
      await t.step("verify json", async () => {
        const ret = await getMiddBody(`{"name": "john"}`, "application/json", {
          json: 1,
        });
        assertEquals(ret.status, 400);
      });
      await t.step("verify urlencoded", async () => {
        const ret = await getMiddBody(
          `name=john`,
          "application/x-www-form-urlencoded",
          { urlencoded: 1 },
        );
        assertEquals(ret.status, 400);
      });
      await t.step("verify raw", async () => {
        const ret = await getMiddBody(`{"name": "john"}`, "text/plain", {
          raw: 1,
        });
        assertEquals(ret.status, 400);
      });
      await t.step("verify raw not json", async () => {
        const ret = await getMiddBody(`my name john`, "text/plain", { raw: 1 });
        assertEquals(ret.status, 400);
      });
    });
    await t.step("disable All", async () => {
      const ret = await getMiddBody(
        `{"name": "john"}`,
        "application/json",
        false,
      );
      assertEquals(ret, {});
    });
    await t.step("options true", async () => {
      const ret = await getMiddBody(
        `{"name": "john"}`,
        "application/json",
        true,
      );
      assertEquals(ret, { "name": "john" });
    });
    await t.step("no verify", async () => {
      const ret = await getMiddBody(
        `{"name": "john"}`,
        "application/json",
      );
      assertEquals(ret, { "name": "john" });
    });
    await t.step("only middleware", async () => {
      const ret = await getMiddBody(
        `{"name": "john"}`,
        "application/json",
        void 0,
        { bodyParser: false },
      );
      assertEquals(ret, { "name": "john" });
    });
    await t.step("only middleware error", async () => {
      const ret = await getMiddBody(
        `{"name": "john"`,
        "application/json",
        void 0,
        { bodyParser: false },
      );
      assertEquals(ret.status, 500);
    });
  });
  await t.step("getType", () => {
    const ret = getType({
      raw: { req: { headers: { [C_TYPE]: JSON_TYPE } } },
    });
    assertEquals(ret, JSON_TYPE);
  });
  await t.step("no parseQuery", async () => {
    const getMiddBody = (
      body?: TRet,
      type?: string,
    ) => {
      const app = nhttp({ bodyParser: false });
      app.post("/", bodyParser(void 0, void 0), (rev) => rev.body);
      return app.req("/", {
        method: "POST",
        headers: type ? { [C_TYPE]: type } : void 0,
        body,
      }).json();
    };
    const ret = await getMiddBody(
      `name=john`,
      "application/x-www-form-urlencoded",
    );
    assertEquals(ret, { "name": "john" });
  });
  await t.step("miss", async (t) => {
    const getMiddBody = (
      type?: string,
    ) => {
      const app = nhttp();
      app.post("/", (rev) => rev.body);
      return app.req("/", {
        method: "POST",
        headers: type ? { [C_TYPE]: type } : void 0,
      }).json();
    };
    await t.step("len 0", async () => {
      const ret = await getMiddBody(
        "application/x-www-form-urlencoded",
      );
      assertEquals(ret, {});
    });
    await t.step("json {}", async () => {
      const ret = await getMiddBody(
        "application/json",
      );
      assertEquals(ret, {});
    });
  });
});
