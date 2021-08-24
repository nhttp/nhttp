import { Handler, TObject } from "../src/types.ts";
import {
  findFns,
  parseQuery,
  serializeCookie,
  toBytes,
  toPathx,
} from "../src/utils.ts";
import { expect } from "./deps.ts";
const { test } = Deno;

const fn: Handler = () => {};

test("parseQuery fn", () => {
  const val = parseQuery("name=foo&name=bar&job=fullstack");
  expect(val, { name: ["foo", "bar"], job: "fullstack" });
});
test("toBytes fn (1kb to be 1024)", () => {
  const val = toBytes("1kb");
  expect(val, 1024);
});
test("serializeCookie", () => {
  const val = serializeCookie("io", "123", {
    httpOnly: true,
  });
  expect(val, "io=123; HttpOnly");
});
test("Create Regex toPathx fn", () => {
  const params = toPathx("/hello/:id", false);
  const std = toPathx("/hello", false);
  const opts = toPathx("/item/:id?", false);
  expect(std, {});
  expect(params.pathx, /^\/hello\/(?<id>[^/]+)\/*$/);
  expect(opts.pathx, /^\/item\/?(?<id>[^/]+)?\/*$/);
});
test("findFns fn", () => {
  const fns = findFns(
    [fn, [fn, fn, [fn], [[[fn]]]], "/str", [["/path-test"]]] as TObject[],
  );
  expect(fns, [fn, fn, fn, fn, fn]);
});
