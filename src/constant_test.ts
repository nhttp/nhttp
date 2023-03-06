import { revMimeList } from "./constant.ts";
import { assertEquals } from "./deps_test.ts";

Deno.test("constant", () => {
  const noop = revMimeList("noop/css");
  assertEquals(noop, "noop/css");
  const txt = revMimeList("text/plain; charset=utf-8");
  assertEquals(txt, "txt");
  const css = revMimeList("text/css");
  assertEquals(css, "css");
  const noop2 = revMimeList("noop/css");
  assertEquals(noop2, "noop/css");
});
