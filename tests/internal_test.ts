import {
  assert,
  assertEquals as expect,
} from "https://deno.land/std@0.105.0/testing/asserts.ts";
import {
  concatRegexp,
  getReqCookies,
  parseQuery,
  serializeCookie,
} from "../src/utils.ts";
import {
  getError,
  Handler,
  HttpError,
  HttpResponse,
  multipart,
  NHttp,
  RequestEvent,
  Router,
} from "./../mod.ts";

const rev = new RequestEvent();
const res = new HttpResponse();

// deno-lint-ignore no-explicit-any
type TObject = { [k: string]: any };

const { test } = Deno;

// dummy middleware
const fn: Handler = () => {};

const router = new Router();
const methods = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"];
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
    expect(typeof rev[name], "undefined");
  });
});
test("getError object", () => {
  const err = new HttpError(500, "my test error", "MyTestError") as TObject;
  const obj = getError(err, true);
  expect(typeof obj, "object");
  const obj2 = getError(new HttpError());
  expect(typeof obj2, "object");
});
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
app.use("/", router);
app.use(fn);
app.use("/assets", fn);

test("Middleware length 1", () => {
  expect(app.midds.length, 1);
});

test("Assets middleware length 2", () => {
  const len = (app.pmidds as TObject)["/assets"].length;
  expect(len, 2);
});

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

test("query params", () => {
  const obj = parseQuery("name=john&name=doe");
  const obj2 = parseQuery("name[firstName]=john 1%%&name[lastName]=doe 2%%");
  const obj3 = parseQuery("location[][lat]=123&location[][lat]=456");
  expect(obj, { name: ["john", "doe"] });
  expect(obj2, {
    name: {
      firstName: "john 1%%",
      lastName: "doe 2%%",
    },
  });
  expect(obj3, {
    location: [
      { lat: "123" },
      { lat: "456" },
    ],
  });
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

myApp.get("/hello", () => "hello");
// handle upload
myApp.post(
  "/upload",
  multipart.upload({
    name: "myfile",
    required: true,
    accept: "txt",
    dest: "dummy/",
    maxCount: 1,
    maxSize: "2 mb",
    callback: (file) => {
      file.filename = "text.txt";
    },
  }),
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
const myRes = await fetch("http://localhost:8080/hello");

const file = new File(["hello world"], "text.txt");
const form = new FormData();
form.append("myfile", file);
form.append("text", "hello");
const myUpload = await fetch("http://localhost:8080/upload", {
  method: "POST",
  body: form,
});
test("it should listen app", () => {
  expect(myRes.status, 200);
  expect(myUpload.status, 201);
  expect((info as TObject).port, 8080);
});
