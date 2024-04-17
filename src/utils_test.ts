import type { Handler } from "../mod.ts";
import { getReqCookies, serializeCookie } from "./cookie.ts";
import { assertEquals } from "./deps_test.ts";
import type { TObject, TRet } from "./types.ts";
import {
  concatRegexp,
  decURIComponent,
  findFn,
  findFns,
  middAssets,
  needPatch,
  parseQuery,
  toBytes,
  toPathx,
} from "./utils.ts";

Deno.test("utils", async (t) => {
  await t.step("decode uri comp", () => {
    const val = decURIComponent("%3Fx%3Dtest");
    assertEquals(val, "?x=test");

    const val2 = decURIComponent("%E0%A4%A");
    assertEquals(val2, "%E0%A4%A");
  });

  await t.step("findFns", () => {
    const val = findFn((_a: TRet, _b: TRet, _c: TRet) => {});
    assertEquals(val.length, 2);

    const handler: Handler = (_a, _b) => {};

    const fns = findFns([handler]);
    assertEquals(typeof fns[0], "function");

    const fns2 = findFns([handler, [handler]]);
    assertEquals(typeof fns2[0], "function");
    assertEquals(typeof fns2[1], "function");
  });
  await t.step("pathx", () => {
    const val = toPathx(/hello/);
    assertEquals(val?.pattern instanceof RegExp, true);
  });
  await t.step("concatRegex", () => {
    assertEquals(concatRegexp("/hello", /\/hello/) instanceof RegExp, true);
    assertEquals(concatRegexp("", /\/hello/) instanceof RegExp, true);
    assertEquals(concatRegexp(/\/hello\//, /\/hello/) instanceof RegExp, true);
  });
  await t.step("toBytes noop", () => {
    const bytes = toBytes("noop");
    assertEquals(bytes, NaN);
  });
  await t.step("toBytes only number", () => {
    const bytes = toBytes(123);
    assertEquals(bytes, 123);
  });
  await t.step("toBytes only number as string", () => {
    const bytes = toBytes("123");
    assertEquals(bytes, 123);
  });
  await t.step("parseQuery is url", () => {
    const obj = parseQuery("url=http://lolcahost/?name=john");
    assertEquals(obj, { url: "http://lolcahost/?name=john" });
  });
  await t.step("parseQuery is url array", () => {
    const obj = parseQuery("urls[]=http://lolcahost/?name=john");
    assertEquals(obj, { urls: ["http://lolcahost/?name=john"] });
  });
  await t.step("parseQuery is null", () => {
    const obj = parseQuery(null);
    assertEquals(obj, {});
  });
  await t.step("parseQuery empty val", () => {
    const obj = parseQuery("name&address=maja");
    assertEquals(obj, { name: "", address: "maja" });
  });
  await t.step("parseQuery empty val 2", () => {
    const obj = parseQuery("name=maja&name");
    assertEquals(obj, { name: ["maja", ""] });
  });
  await t.step("parseQuery empty val 3", () => {
    const obj = parseQuery("name[]=maja&name[]");
    assertEquals(obj, { name: ["maja", ""] });
  });
  await t.step("parseQuery array", () => {
    const obj = parseQuery("loc=1&loc=2&loc=3");
    assertEquals(obj, { loc: ["1", "2", "3"] });
  });
  await t.step("parseQuery object", () => {
    const obj = parseQuery("loc[foo]=1");
    assertEquals(obj, { loc: { foo: "1" } });
  });
  await t.step("parseQuery object noop", () => {
    const obj = parseQuery("loc=1&loc[]=2");
    assertEquals(obj, { loc: "1" });
  });
  await t.step("needPatch obj", () => {
    const obj = needPatch(void 0 as unknown as TObject, [1], "2");
    assertEquals(typeof obj, "object");
  });
  await t.step("middAssets", () => {
    const midd: Handler = (rev, next) => {
      assertEquals(rev.url, "/");
      assertEquals(rev.path, "/");
      return next();
    };
    middAssets("/")[midd as TRet];
  });
  await t.step("serialize cookie", () => {
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
      new Headers({ "Cookie": cookie }),
      true,
    );
    const obj3 = getReqCookies(
      new Headers({
        "Cookie": serializeCookie("test", 'j:[{ "name": "john" }]', {
          encode: true,
        }),
      }),
      true,
    );
    assertEquals(obj, {
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
    assertEquals(typeof obj3, "object");
    assertEquals(typeof cookie, "string");
  });
});
