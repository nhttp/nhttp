import { assert, expect } from "./assert.ts";
import { Handler, NHttp, Router } from "./../mod.ts";

// deno-lint-ignore no-explicit-any
type TObject = { [k: string]: any };

const { test } = Deno;

// dummy middleware
const fn: Handler = () => {};

const router = new Router();
const methods = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"];
test("Router method is function", () => {
  methods.forEach((method) => {
    // deno-lint-ignore no-explicit-any
    expect(typeof (router as any)[method.toLowerCase()], "function");
  });
});

// router fns support like router.get('/', [[fn, fn], [[[fn]]]], fn, () => { })
router
  .get("/deno", [fn, fn], fn, () => {})
  .post("/node", [fn], [fn, [fn]] as Handler[], fn, () => {})
  .put("/php", [[[fn]], [fn, [fn]]] as unknown as Handler[], [fn], () => {});
test("Router length 3", () => {
  expect(router.c_routes.length, 3);
});

// check route method + path
router.c_routes.forEach(({ method, path }: TObject) => {
  if (method === "GET") {
    test("Route GET/deno", () => {
      expect(method + path, "GET/deno");
    });
  } else if (method === "POST") {
    test("Route POST/node", () => {
      expect(method + path, "POST/node");
    });
  } else if (method === "PUT") {
    test("Route PUT/php", () => {
      expect(method + path, "PUT/php");
    });
  }
});

const app = new NHttp();
app.use(router);

// convert fns [[[fn], fn], fn] to [fn, fn, fn] with recursive
for (const route in app.route) {
  if (route === "GET/deno") {
    test("Route GET/deno have fns 4", () => {
      expect(app.route[route].fns.length, 4);
    });
  } else if (route === "POST/node") {
    test("Route POST/node have fns 5", () => {
      expect(app.route[route].fns.length, 5);
    });
  } else if (route === "PUT/php") {
    test("Route PUT/php have fns 5", () => {
      expect(app.route[route].fns.length, 5);
    });
  }
}

// parameters
app
  .post("/:filename.(png|jpg|gif)", () => {})
  .put("/:id", () => {})
  .delete("/:id?", () => {})
  .get("/*", () => {});

const METHOD_URL_MATCH = [
  ["GET", "/exact/all"],
  ["POST", "/image.jpg"],
  ["POST", "/image.pdf"],
  ["PUT", "/123"],
  ["DELETE", "/321"],
  ["DELETE", "/"],
];

METHOD_URL_MATCH.forEach(([method, url]) => {
  if (method === "GET" && url === "/exact/all") {
    test("Route GET/exact/all", () => {
      const obj: TObject = app.find(method, url, () => {});
      assert(obj.params.wild.length === 2);
      expect(obj.params, { wild: ["exact", "all"] });
    });
  } else if (method === "POST" && url === "/image.jpg") {
    test("Route POST/image.jpg", () => {
      const obj: TObject = app.find(method, url, () => {});
      expect(obj.params.filename, "image");
    });
  } else if (method === "POST" && url === "/image.pdf") {
    test("Route POST/image.pdf", () => {
      const obj: TObject = app.find(method, url, () => {});
      expect(obj.params.filename, undefined);
    });
  } else if (method === "PUT" && url === "/123") {
    test("Route PUT/123", () => {
      const obj: TObject = app.find(method, url, () => {});
      expect(obj.params.id, "123");
    });
  } else if (method === "DELETE" && url === "/321") {
    test("Route DELETE/321", () => {
      const obj: TObject = app.find(method, url, () => {});
      expect(obj.params.id, "321");
    });
  } else if (method === "DELETE" && url === "/") {
    test("Route DELETE/", () => {
      const obj: TObject = app.find(method, url, () => {});
      expect(obj.params.id, undefined);
    });
  }
});
