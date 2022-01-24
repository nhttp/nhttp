import {
  assertEquals as expect,
} from "https://deno.land/std@0.105.0/testing/asserts.ts";
import { TObject } from "../src/types.ts";
import {
  concatRegexp,
  decURI,
  getReqCookies,
  needPatch,
  parseQuery,
  serializeCookie,
  toBytes,
} from "../src/utils.ts";
import {
  getError,
  HttpError,
  HttpResponse,
  RequestEvent,
  Router,
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
  await t.step("toBytes only number as string", () => {
    const bytes = toBytes("123");
    expect(bytes, 123);
  });
  await t.step("parseQuery is null", () => {
    const obj = parseQuery(null);
    expect(obj, {});
  });
  await t.step("parseQuery empty val", () => {
    const obj = parseQuery("name&address=maja");
    expect(obj, { name: "", address: "maja" });
  });
  await t.step("parseQuery array", () => {
    const obj = parseQuery("loc=1&loc=2&loc=3");
    expect(obj, { loc: ["1", "2", "3"] });
  });
  await t.step("needPatch obj", () => {
    const obj = needPatch(void 0 as unknown as TObject, [1], "2");
    expect(typeof obj, "object");
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
Deno.test("getError object", async (t) => {
  await t.step("Misc error", () => {
    const obj = getError({ status: "asdasd" });
    expect(obj, {
      status: 500,
      message: "Something went wrong",
      name: "HttpError",
      stack: undefined,
    });
  });
  await t.step("Misc error with stack", () => {
    const obj = getError({
      status: "asdasd",
      stack: `at file
    file://noop.ts line 1000
    at file 
    file://noop2.ts line 1200`,
    }, true);
    expect(obj, {
      status: 500,
      message: "Something went wrong",
      name: "HttpError",
      stack: ["file://noop.ts line 1000", "file://noop2.ts line 1200"],
    });
  });
  await t.step("Misc error without stack", () => {
    const obj = getError({
      status: 500,
      stack: void 0,
    }, true);
    expect(obj, {
      status: 500,
      message: "Something went wrong",
      name: "HttpError",
      stack: [],
    });
  });
  await t.step("HttpError", () => {
    const err = new HttpError(500, "my test error", "MyTestError") as TObject;
    const obj = getError(err, true);
    expect(typeof obj, "object");
  });
  await t.step("HttpError no params", () => {
    const obj = getError(new HttpError());
    expect(typeof obj, "object");
  });
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

Deno.test("Single router", () => {
  const router = new Router();
  router.on("GET", /hello/, () => {});
  expect(Array.isArray(router.c_routes), true);
});
