import Router, { concatRegexp, decURI, wildcard } from "./router.ts";
import { assertEquals } from "./deps_test.ts";

Deno.test("router", async (t) => {
  await t.step("router regex", () => {
    const router = new Router();
    router.on("GET", /hello/, () => {});
    assertEquals(Array.isArray(router.c_routes), true);
  });
  await t.step("decode uri", () => {
    const val = decURI("/hello?name=sahimar");
    assertEquals(val, "/hello?name=sahimar");

    const val2 = decURI("%E0%A4%A");
    assertEquals(val2, "%E0%A4%A");
  });
  await t.step("concatRegex", () => {
    assertEquals(concatRegexp("/hello", /\/hello/) instanceof RegExp, true);
    assertEquals(concatRegexp("", /\/hello/) instanceof RegExp, true);
    assertEquals(concatRegexp(/\/hello\//, /\/hello/) instanceof RegExp, true);
  });
  await t.step("single", () => {
    const router = new Router();
    router.route = {
      "GET/": {
        fns: [],
        m: true,
      },
    };
    const data = router["getRoute"]("GET/");
    assertEquals(data, { fns: [] });
  });

  await t.step("wild", () => {
    const wild = wildcard("/", false, {});
    const wild2 = wildcard(undefined, true, {});
    const wild3 = wildcard("/", true, {});
    assertEquals(wild, {});
    assertEquals(wild2, {});
    assertEquals(wild3, {});
  });
  await t.step("router miss", () => {
    const router = new Router();
    router.options("/", () => {});
    router.connect("/", () => {});
    router.trace("/", () => {});
    router.delete("/", () => {});
    assertEquals(Array.isArray(router.c_routes), true);
  });
});
