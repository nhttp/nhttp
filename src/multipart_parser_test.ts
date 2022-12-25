import { multiParser } from "./multipart_parser.ts";
import { nhttp } from "./nhttp.ts";
import { superdeno } from "./deps_test.ts";

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
    await superdeno(app.handle)
      .post("/")
      .set("Accept", "multipart/form-data")
      .field("name", "John")
      .attach("file", new File(["hello"], "text.txt", { type: "text/plain" }))
      .expect(200);
    await superdeno(app.handle)
      .post("/")
      .set("Accept", "multipart/form-data")
      .field("name", "John")
      .attach("file", new File(["hello"], "text.txt", { type: "text/plain" }))
      .attach("file", new File(["hello2"], "text2.txt", { type: "text/plain" }))
      .expect(200);
  });
});
