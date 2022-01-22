import {
  assertEquals as expect,
} from "https://deno.land/std@0.105.0/testing/asserts.ts";
import {
  middAssets,
  concatRegexp,
  getReqCookies,
  parseQuery,
  serializeCookie,
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

// deno-lint-ignore no-explicit-any
type TObject = { [k: string]: any };

const { test } = Deno;
test("concatRegexp instanceof RegExp", () => {
  expect(concatRegexp("/hello", /\/hello/) instanceof RegExp, true);
  expect(concatRegexp(/\/hello\//, /\/hello/) instanceof RegExp, true);
});
test("RequestEvent undefined first", () => {
  const names = Object.getOwnPropertyNames(rev);
  names.forEach((name) => {
    expect(typeof rev[name], "undefined");
  });
});
test("HttpResponse undefined first", () => {
  const names = Object.getOwnPropertyNames(res);
  names.forEach((name) => {
    expect(typeof res[name], "undefined");
  });
});
test("getError object", () => {
  const err = new HttpError(500, "my test error", "MyTestError") as TObject;
  const obj = getError(err, true);
  expect(typeof obj, "object");
  const obj2 = getError(new HttpError());
  expect(typeof obj2, "object");
});

test("cookie", () => {
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

const form2 = new FormData();
form2.append("myfile", new File(["hello world"], "text.txt"));
form2.append("myfile", new File(["hello world"], "foo.txt"));
const myUploadErrorMaxCount = await fetch(BASE + "/upload", {
  method: "POST",
  body: form2,
});

const form3 = new FormData();
form3.append("myfile", new File(["html {color: black}"], "text.css"));
const myUploadErrorAccept = await fetch(BASE + "/upload", {
  method: "POST",
  body: form3,
});

const form4 = new FormData();
form4.append("myfile", new File(["html {color: black}"], "text.css"));
form4.append("myfile2", new File(["hello world"], "text.txt"));
const myUploadArray = await fetch(BASE + "/upload-array", {
  method: "POST",
  body: form4,
});

const form5 = new FormData();
form5.append('hello', 'hello');
const myUploadErroRequired = await fetch(BASE + "/upload", {
  method: "POST",
  body: form5,
});
test("it should listen app", () => {
  expect(myRes.status, 200);
  expect(myUploadArray.status, 201);
  expect(myUploadErroRequired.status, 400);
  expect(myUploadErrorMaxCount.status, 400);
  expect(myUploadErrorAccept.status, 400);
  expect(myUpload.status, 201);
  expect((info as TObject).port, 8080);
});
