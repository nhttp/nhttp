import {
  assertEquals as expect,
} from "https://deno.land/std@0.105.0/testing/asserts.ts";
import { multipart, NHttp } from "../mod.ts";
import { TObject, TRet } from "../src/types.ts";
import { myParse } from "../src/utils.ts";

const myApp = new NHttp();

const sleep = (ms: number) => new Promise((ok) => setTimeout(ok, ms));
const BASE = "http://localhost:8080";
const upload = multipart.upload({
  name: "myfile",
  required: true,
  accept: "txt",
  dest: "dummy/",
  maxCount: 1,
  maxSize: "2 mb",
  callback: (file) => {
    file.filename = "text.txt";
  },
});
const uploadArray = multipart.upload([
  {
    name: "myfile",
    required: true,
    accept: "css",
    dest: "dummy/",
    maxSize: "2 mb",
    callback: (file) => {
      file.filename = "text.css";
    },
  },
  {
    name: "myfile2",
    required: true,
    accept: "txt",
    dest: "dummy/",
    maxSize: "2 mb",
    callback: (file) => {
      file.filename = "text.txt";
    },
  },
]);
myApp.get("/hello", () => "hello");
myApp.post(
  "/upload",
  upload,
  ({ response }) => {
    response.status(201);
    return "success";
  },
);
myApp.post(
  "/upload-array",
  uploadArray,
  ({ response }) => {
    response.status(201);
    return "success";
  },
);

const info = await new Promise((ok) => {
  myApp.listen(8080, (_, info) => {
    ok(info);
  });
});
const infoSSL = await new Promise((ok) => {
  myApp.listen({
    port: 8081,
    certFile: "./dummy/localhost.cert",
    keyFile: "./dummy/localhost.key",
    alpnProtocols: ["h2", "http/1.1"],
  }, (_, info) => {
    ok(info);
  });
});
const infoFail = await new Promise((ok) => {
  myApp.listen({
    port: 8082,
    certFile: "./dummy/localhost.crt",
  }, (err, info) => {
    if (err) return ok(err);
    ok(info);
  });
});
await sleep(2000);
const myRes = await fetch(BASE + "/hello");

const form = new FormData();
form.append("myfile", new File(["hello world"], "text.txt"));
form.append("text", "hello");
const myUpload = await fetch(BASE + "/upload", {
  method: "POST",
  body: form,
});

const form4 = new FormData();
form4.append("myfile", new File(["html {color: black}"], "text.css"));
form4.append("myfile2", new File(["hello world"], "text.txt"));
const myUploadArray = await fetch(BASE + "/upload-array", {
  method: "POST",
  body: form4,
});

const form5 = new FormData();
form5.append("hello", "hello");
const myUploadErrorRequired = await fetch(BASE + "/upload", {
  method: "POST",
  body: form5,
});

const form6 = new FormData();
form6.append("hello", "hello");
const myUploadArrayRequeired = await fetch(BASE + "/upload-array", {
  method: "POST",
  body: form6,
});
Deno.test("it should listen app", () => {
  expect((infoFail as TObject).name, "TypeError");
  expect(myRes.status, 200);
  expect((info as TObject).port, 8080);
  expect((infoSSL as TObject).port, 8081);
});

Deno.test("Multipart", async (t) => {
  await t.step("validate form", () => {
    expect(myUploadArray.status, 201);
    expect(myUploadErrorRequired.status, 400);
    expect(myUploadArrayRequeired.status, 400);
    expect(myUpload.status, 201);
  });
  await t.step("Optional parse", () => {
    const myParseTest = (obj: TObject) => {
      const arr = [] as TObject[];
      for (const key in obj) {
        arr.push([key, obj[key]]);
      }
      return arr;
    };
    const form = new FormData();
    form.append("name", "john");
    form.append("address[one]", "jakarta");
    form.append("address[two]", "majalengka");
    const obj = multipart.createBody(form, {
      // example parse using options
      // Use qs.parse instead for case. https://github.com/ljharb/qs.
      parse: (f: TRet) => myParse(myParseTest(f) as TRet),
    });
    expect(obj, {
      name: "john",
      address: { one: "jakarta", two: "majalengka" },
    });
  });
  await t.step("validate max count", () => {
    const file = new File(["hello world"], "text.txt");
    let obj;
    try {
      obj = multipart["validate"]([file, file], {
        name: "file",
        maxCount: 1,
      });
    } catch (err) {
      obj = err;
    }
    expect(obj.message, "file no more than 1 file");
  });
  await t.step("validate accept", () => {
    const file = new File(["hello world"], "text.txt");
    let obj;
    try {
      obj = multipart["validate"]([file], {
        name: "file",
        accept: "png|jpg",
      });
    } catch (err) {
      obj = err;
    }
    expect(obj.message, "file only accept png|jpg");
  });
  await t.step("validate max size", () => {
    const file = new File(["hello world"], "text.txt");
    let obj;
    try {
      obj = multipart["validate"]([file], {
        name: "file",
        maxSize: 1,
      });
    } catch (err) {
      obj = err;
    }
    expect(obj.message, "file to large, maxSize = 1");
  });
  await t.step("cleanup body", async () => {
    const body = {
      name: "john",
      file: new File(["hello"], "text.txt"),
      file2: [new File(["hello"], "text.txt")],
    } as TObject;
    await multipart["privUpload"]([new File(["hello"], "text.dump")], {
      name: "text",
      dest: "dummy/",
    });
    multipart["cleanUp"](body);
    expect(body, { name: "john" });
    for await (const dirEntry of Deno.readDir("dummy")) {
      if (dirEntry.isFile) {
        if (dirEntry.name.endsWith(".dump")) {
          try {
            Deno.removeSync("dummy/" + dirEntry.name);
          } catch (_e) { /* noop */ }
        }
      }
    }
  });
});
