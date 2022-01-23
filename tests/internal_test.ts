import {
  assertEquals as expect,
} from "https://deno.land/std@0.105.0/testing/asserts.ts";
import { TObject } from "../src/types.ts";
import {
  concatRegexp,
  decURI,
  getReqCookies,
  parseQuery,
  serializeCookie,
  toBytes,
} from "../src/utils.ts";
import {
  getError,
  HttpError,
  HttpResponse,
  multipart,
  NHttp,
  RequestEvent,
} from "./../mod.ts";

const rev = new RequestEvent();
const res = new HttpResponse();

Deno.test("Utils", async (t) => {
  await t.step("concatRegex", () => {
    expect(concatRegexp("/hello", /\/hello/) instanceof RegExp, true);
    expect(concatRegexp("", /\/hello/) instanceof RegExp, true);
    expect(concatRegexp(/\/hello\//, /\/hello/) instanceof RegExp, true);
  });
  await t.step("decUri", () => {
    const str = decURI("hello%20world%%%%%%");
    const str2 = decURI("hello%20world");
    expect(str, "hello%20world%%%%%%");
    expect(str2, "hello world");
  });
  await t.step("toBytes only number", () => {
    const bytes = toBytes(123);
    expect(bytes, 123);
  });
  await t.step("parseQuery is null", () => {
    const obj = parseQuery(null);
    expect(obj, {});
  });
  await t.step("misc error", () => {
    const obj = getError({ status: "asdasd" });
    console.log(obj);
    expect(obj, {
      status: 500,
      message: "Something went wrong",
      name: "HttpError",
      stack: undefined,
    });
  });
});
Deno.test("RequestEvent undefined first", () => {
  const names = Object.getOwnPropertyNames(rev);
  names.forEach((name) => {
    expect(typeof rev[name], "undefined");
  });
});
Deno.test("HttpResponse undefined first", () => {
  const names = Object.getOwnPropertyNames(res);
  names.forEach((name) => {
    expect(typeof res[name], "undefined");
  });
});
Deno.test("getError object", () => {
  const err = new HttpError(500, "my test error", "MyTestError") as TObject;
  const obj = getError(err, true);
  expect(typeof obj, "object");
  const obj2 = getError(new HttpError());
  expect(typeof obj2, "object");
});

Deno.test("cookie", () => {
  const now = Date.now();
  const date = new Date();
  const cookie = serializeCookie("__Secure", "value", {
    maxAge: now,
    secure: true,
    sameSite: "Lax",
    domain: "xxx.com",
    expires: date,
    httpOnly: true,
    path: "/",
    other: ["other"],
    encode: true,
  });
  serializeCookie("__Host", "value");
  const obj = getReqCookies(
    new Request("http://x.x/", {
      headers: new Headers({ "Cookie": cookie }),
    }),
    true,
  );
  const obj2 = getReqCookies(
    new Request("http://x.x", {
      headers: new Headers({
        "Cookie": serializeCookie("test", 'j:{ "name": "john" }', {
          encode: true,
        }),
      }),
    }),
    true,
  );
  const obj3 = getReqCookies(
    new Request("http://x.x", {
      headers: new Headers({
        "Cookie": serializeCookie("test", 'j:[{ "name": "john" }]', {
          encode: true,
        }),
      }),
    }),
    true,
  );
  expect(obj, {
    __Secure: "value",
    Secure: "",
    HttpOnly: "",
    "Max-Age": now.toString(),
    Domain: "xxx.com",
    SameSite: "Lax",
    Path: "/",
    Expires: date.toUTCString(),
    other: "",
  });
  expect(typeof obj2, "object");
  expect(typeof obj3, "object");
  expect(typeof cookie, "string");
});

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
  myApp.listen({ port: 8080 }, (_, info) => {
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
Deno.test("it should listen app", () => {
  expect(myRes.status, 200);
  expect((info as TObject).port, 8080);
});

Deno.test("Multipart", async (t) => {
  expect(myUploadArray.status, 201);
  expect(myUploadErrorRequired.status, 400);
  expect(myUpload.status, 201);
  await t.step("Optional parse", () => {
    const form = new FormData();
    form.append("name", "john");
    const obj = multipart.createBody(form, {
      // example parse using options
      // Use qs.parse instead for case. https://github.com/ljharb/qs.
      parse: (f: TObject) => f,
    });
    expect(obj, { name: "john" });
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
});
