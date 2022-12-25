import { getError, HttpError } from "./error.ts";
import { assertEquals } from "./deps_test.ts";

Deno.test("error", async (t) => {
  await t.step("http error no params", () => {
    const err = new HttpError();
    assertEquals(err.status, 500);
    assertEquals(err.message, "Http Error");
    assertEquals(err.name, "HttpError");
  });
  await t.step("http error", () => {
    const err = new HttpError(500, "noop error", "servererror");
    assertEquals(err.status, 500);
    assertEquals(err.message, "noop error");
    assertEquals(err.name, "servererror");
  });

  await t.step("getError without stack", () => {
    const obj = getError(new HttpError(500, "noop error", "servererror"));
    assertEquals(obj.status, 500);
    assertEquals(obj.message, "noop error");
    assertEquals(obj.name, "servererror");
    assertEquals(typeof obj.stack, "undefined");
  });
  await t.step("getError with stack undefined", () => {
    const obj = getError({
      status: 500,
      message: "noop error",
      name: "servererror",
      stack: undefined,
    }, true);
    assertEquals(obj.status, 500);
    assertEquals(obj.message, "noop error");
    assertEquals(obj.name, "servererror");
    assertEquals(typeof obj.stack, "object");
  });
  await t.step("getError with stack real", () => {
    const obj = getError({
      status: 500,
      message: "noop error",
      name: "servererror",
      stack: `at file
    file://noop.ts line 1000
    at file 
    file://noop2.ts line 1200`,
    }, true);
    assertEquals(obj.status, 500);
    assertEquals(obj.message, "noop error");
    assertEquals(obj.name, "servererror");
    assertEquals(typeof obj.stack, "object");
  });
  await t.step("getError no value", () => {
    const obj = getError({});
    assertEquals(obj.status, 500);
    assertEquals(obj.message, "Something went wrong");
    assertEquals(obj.name, "HttpError");
  });
  await t.step("getError miss value", () => {
    const obj = getError({ status: "123" });
    assertEquals(obj.status, 500);
    assertEquals(obj.message, "Something went wrong");
    assertEquals(obj.name, "HttpError");
  });
});
