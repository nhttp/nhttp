import { byteIndexOf, multiParser } from "./multipart_parser.ts";
import { nhttp } from "./nhttp.ts";
import { superdeno } from "./deps_test.ts";
import { encoder } from "./utils.ts";
import { assertEquals } from "./deps_test.ts";

Deno.test("multipart parser", async (t) => {
  await t.step("parser", async () => {
    const app = nhttp({
      bodyParser: {
        multipart: false,
      },
    });
    app.post("/", async ({ request }) => {
      const data = await multiParser(request);
      return data;
    });
    app.post("/array-buffer", async ({ request }) => {
      const data = await multiParser(request);
      await data?.file.arrayBuffer();
      return data;
    });
    await superdeno(app.handle)
      .post("/")
      .set("Accept", "multipart/form-data")
      .field("name", "John")
      .attach("file", new File(["hello"], "text.txt", { type: "text/plain" }))
      .expect(200);
    await superdeno(app.handle)
      .post("/")
      .set("Accept", "multipart/form-data")
      .attach("file", new File(["hello"], "text.txt", { type: "text/plain" }))
      .attach("file", new File(["hello2"], "text2.txt", { type: "text/plain" }))
      .expect(200);
    await superdeno(app.handle)
      .post("/")
      .set("Accept", "multipart/form-data")
      .field("name", "John")
      .expect(200);
    await superdeno(app.handle)
      .post("/array-buffer")
      .set("Accept", "multipart/form-data")
      .field("name", "John")
      .attach("file", new File(["hello"], "text.txt", { type: "text/plain" }))
      .expect(200);
  });
  await t.step("byteIndexOf", () => {
    const source = new Uint8Array([12]);
    const ret = byteIndexOf(source, encoder.encode("Content-Type"), 1000);
    assertEquals(ret, -1);
  });
});
