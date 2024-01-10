import Router, { findParams } from "./router.ts";
import { assertEquals } from "./deps_test.ts";

Deno.test("router", async (t) => {
  await t.step("router regex", () => {
    const router = new Router();
    router.on("GET", /hello/, () => {});
    assertEquals(Array.isArray(router.c_routes), true);
  });
  await t.step("wild", () => {
    const wild = findParams({ path: "/", wild: false, pattern: {} }, "/");
    const wild2 = findParams(
      { path: undefined, wild: false, pattern: {} },
      "/",
    );
    const wild3 = findParams({ path: "/", wild: true, pattern: {} }, "/");
    assertEquals(wild, {});
    assertEquals(wild2, {});
    assertEquals(wild3, {});
  });
  await t.step("router miss", () => {
    const router = new Router();
    router.use("/hello", () => {});
    router.options("/", () => {});
    router.connect("/", () => {});
    router.trace("/", () => {});
    router.delete("/", () => {});
    router.get("/hello", (rev) => {
      assertEquals(rev.__prefix, "/hello");
      assertEquals(rev.url, rev.__url);
      assertEquals(rev.path, rev.__path);
      return new Response("hello");
    });
    router.add("GET", "/add", () => {});
    router.add(["GET", "PUT"], "/add-multi", () => {});
    router.get("/:name", () => {});
    const arr = router.c_routes;
    assertEquals(Array.isArray(arr), true);
    assertEquals(arr.find((el) => el.path == "/hello")?.fns.length, 1);
    assertEquals(
      arr.find((el) => el.path == "/add" && el.method === "GET")?.fns.length,
      1,
    );
    assertEquals(
      arr.find((el) => el.path == "/add-multi" && el.method === "GET")?.fns
        .length,
      1,
    );
    assertEquals(
      arr.find((el) => el.path == "/add-multi" && el.method === "PUT")?.fns
        .length,
      1,
    );
  });
});
