import Router, { base, concatRegexp, findParams } from "./router.ts";
import { assertEquals } from "./deps_test.ts";

Deno.test("router", async (t) => {
  await t.step("router regex", () => {
    const router = new Router();
    router.on("GET", /hello/, () => {});
    assertEquals(Array.isArray(router.c_routes), true);
  });
  await t.step("concatRegex", () => {
    assertEquals(concatRegexp("/hello", /\/hello/) instanceof RegExp, true);
    assertEquals(concatRegexp("", /\/hello/) instanceof RegExp, true);
    assertEquals(concatRegexp(/\/hello\//, /\/hello/) instanceof RegExp, true);
  });
  await t.step("wild", () => {
    const wild = findParams({ path: "/", wild: false, pathx: {} }, "/");
    const wild2 = findParams({ path: undefined, wild: false, pathx: {} }, "/");
    const wild3 = findParams({ path: "/", wild: true, pathx: {} }, "/");
    assertEquals(wild, {});
    assertEquals(wild2, {});
    assertEquals(wild3, {});
  });
  await t.step("router miss", () => {
    assertEquals(base("/"), "/");
    const router = new Router();
    router.use("/hello", () => {});
    router.options("/", () => {});
    router.connect("/", () => {});
    router.trace("/", () => {});
    router.delete("/", () => {});
    router.get("/hello", (rev) => {
      assertEquals(rev.url, rev.__url);
      assertEquals(rev.path, rev.__path);
      return new Response("hello");
    });
    router.get("/:name", () => {});
    const arr = router.c_routes;
    assertEquals(Array.isArray(arr), true);
    assertEquals(arr.find((el) => el.path == "/hello")?.fns.length, 3);
  });
});
