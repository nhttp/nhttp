import { multipart, TMultipartUpload } from "./multipart.ts";
import { assertEquals } from "./deps_test.ts";
import { TObject, TRet } from "./types.ts";
import { myParse } from "./utils.ts";
import { RequestEvent } from "./request_event.ts";
type MyNext = (err?: Error) => TRet;
Deno.test("multipart upload", async (t) => {
  const req = (body: TRet) =>
    new Request("http://127.0.0.1:8000/", { method: "POST", body });
  await t.step("upload file with option", async () => {
    const upload = multipart.upload({
      name: "myfile",
      dest: "dummy",
      required: true,
      accept: "txt",
      maxCount: 1,
      maxSize: "2 mb",
      callback: (file) => {
        file.filename = "text.txt";
      },
    });
    const form = new FormData();
    form.set(
      "myfile",
      new File(["hello world"], "text.txt", { type: "text/plain" }),
    );
    const rev = new RequestEvent(req(form));
    const data = await upload(rev, ((err) => err) as MyNext);
    const ok = data === undefined;
    assertEquals(ok, true);
  });
  await t.step("upload file with handler", async () => {
    const upload = multipart.upload({
      name: "myfile",
      writeFile: () => {},
    });
    const form = new FormData();
    form.set(
      "myfile",
      new File(["hello world"], "text.txt", { type: "text/plain" }),
    );
    const rev = new RequestEvent(req(form));
    const data = await upload(rev, ((err) => err) as MyNext);
    const ok = data === undefined;
    assertEquals(ok, true);
  });
  await t.step("upload file multiple", async () => {
    const upload = multipart.upload([
      {
        name: "myfile",
        required: true,
        accept: "txt",
        dest: "/dummy",
        maxSize: "2 mb",
        writeFile: () => {},
      },
      {
        name: "myfile2",
        required: true,
        accept: "css",
        dest: "dummy",
        maxSize: "2 mb",
        writeFile: () => {},
      },
    ]);
    const form = new FormData();
    form.set(
      "myfile",
      new File(["hello world"], "text.txt", { type: "text/plain" }),
    );
    form.set(
      "myfile2",
      new File(["html {color: black}"], "text.css", { type: "text/css" }),
    );
    const rev = new RequestEvent(req(form));
    const data = await upload(rev, ((err) => err) as MyNext);
    const ok = data === undefined;
    assertEquals(ok, true);
  });
  await t.step("upload file verify", async (t) => {
    const opts: TMultipartUpload = {
      name: "myfile",
      required: true,
      accept: "txt",
      dest: "dummy",
      maxSize: 1,
      maxCount: 1,
      writeFile: () => {},
    };
    const handler = async (rev: TRet, upload: TRet, message: string) => {
      try {
        await upload(rev, (err: Error) => err);
        assertEquals("error", message);
      } catch (error) {
        assertEquals(error.message, message);
      }
    };
    await t.step("verify maxSize", async () => {
      const upload = multipart.upload(opts);
      const form = new FormData();
      form.set(
        "myfile",
        new File(["hello world"], "text.txt", { type: "text/plain" }),
      );
      const rev = new RequestEvent(req(form));
      await handler(rev, upload, "myfile to large, maxSize = 1");
    });
    await t.step("verify maxCount", async () => {
      const upload = multipart.upload({ ...opts, maxSize: "3mb" });
      const form = new FormData();
      form.set(
        "myfile",
        new File(["hello world"], "text.txt", { type: "text/plain" }),
      );
      form.append(
        "myfile",
        new File(["hello world"], "text.txt", { type: "text/plain" }),
      );
      const rev = new RequestEvent(req(form));
      await handler(rev, upload, "myfile no more than 1 file");
    });
    await t.step("verify required single", async () => {
      const upload = multipart.upload({ ...opts, maxSize: "3mb" });
      const form = new FormData();
      form.set(
        "data",
        new File(["hello world"], "text.txt", { type: "text/plain" }),
      );
      const rev = new RequestEvent(req(form));
      await handler(rev, upload, "Field myfile is required");
    });
    await t.step("verify required array", async () => {
      const upload = multipart.upload([{ ...opts, maxSize: "3mb" }]);
      const form = new FormData();
      form.set(
        "data",
        new File(["hello world"], "text.txt", { type: "text/plain" }),
      );
      const rev = new RequestEvent(req(form));
      await handler(rev, upload, "Field myfile is required");
    });
    await t.step("verify accept", async () => {
      const upload = multipart.upload([{ ...opts, maxSize: "3mb" }]);
      const form = new FormData();
      form.set(
        "myfile",
        new File(["hello world"], "text.css", { type: "text/css" }),
      );
      const rev = new RequestEvent(req(form));
      await handler(rev, upload, "myfile only accept txt");
    });
  });
  await t.step("multipart", async (t) => {
    await t.step("isFile", () => {
      assertEquals(multipart["isFile"]({ arrayBuffer: () => {} }), true);
    });

    await t.step("createBody with parser", () => {
      const form = new FormData();
      form.append("name", "john");
      form.append("address[one]", "jakarta");
      form.append("address[two]", "majalengka");
      const myParseTest = (obj: TObject) => {
        const arr = [] as TObject[];
        for (const key in obj) {
          arr.push([key, obj[key]]);
        }
        return arr;
      };
      assertEquals(
        typeof multipart.createBody(form, {
          // example parse using options
          // Use qs.parse instead for case. https://github.com/ljharb/qs.
          parse: (f: TRet) => myParse(myParseTest(f) as TRet),
        }),
        "object",
      );
    });
    await t.step("createBody without parser", () => {
      const form = new FormData();
      form.set(
        "myfile",
        new File(["hello world"], "text.txt", { type: "text/plain" }),
      );
      assertEquals(typeof multipart.createBody(form), "object");
    });
    await t.step("cleanup body", () => {
      const body = {
        name: "john",
        file: new File(["hello"], "text.txt", { type: "text/plain" }),
        file2: [new File(["hello"], "text.txt", { type: "text/plain" })],
      } as TObject;
      multipart["cleanUp"](body);
      assertEquals(body, { name: "john" });
    });
  });
  await t.step("upload file no formData", async () => {
    const upload = multipart.upload({
      name: "myfile",
      writeFile: () => {},
    });
    const form = new FormData();
    const rev = new RequestEvent(req(form));
    const data = await upload(rev, ((err) => err) as MyNext);
    const ok = data === undefined;
    assertEquals(ok, true);
  });
});
