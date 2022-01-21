import { superdeno } from "https://deno.land/x/superdeno@4.7.2/mod.ts";
import { TObject } from "../src/types.ts";
import {
  expressMiddleware,
  JsonResponse,
  NextFunction,
  NHttp,
} from "./../mod.ts";

type EMidd = (
  req: TObject,
  _: TObject,
  next: NextFunction,
) => void | Promise<void>;

const sleep = (ms: number) => new Promise((ok) => setTimeout(ok, ms));

const app = new NHttp({
  env: "production",
  bodyLimit: {
    json: "2mb",
    urlencoded: "2mb",
    raw: "2mb",
    multipart: "100mb",
  },
});
const handle = (request: Request) => app.handleEvent({ request });
const handleApp = (myapp: NHttp) =>
  (request: Request) => myapp.handleEvent({ request });

// normal path
app.use("/hello", () => "Hello");
app.get("/", () => "Hello");

// feature response
app.get("/res", ({ response }) => {
  response.type("text/html");
  response.header("x-powered-by", "nhttp");
  response.header({ "name": "john" });
  response.header(new Headers({ "name1": "john" }));
  response.cookie("key", "value");
  response.cookie("key1", { "no": "1" });
  response.clearCookie("key");
  return "<h1>hello</h1>";
});

// async
app.get("/async", async () => {
  await sleep(1000);
  return "Hello";
});

// send json
app.get("/json", () => ({ name: "john" }));
app.get("/json2", () =>
  new JsonResponse({ name: "john" }, {
    headers: new Headers({
      "x-powered-by": "nhttp",
    }),
  }));

// test query
app.get("/users", ({ query }) => query);

// test params
app.get("/users/:usersId/books/:bookId", ({ params }) => params);

// test params extension
app.get("/image/:name.(jpg|png)", ({ params }) => params);

// test error
app.get("/noop500", ({ noop }) => {
  noop();
  return "noop";
});

// test regexp
app.get(/\/hello/, () => "Hello Regexp");

// test post and status 201
app.post("/post", ({ response, body }) => {
  response.status(201);
  return body;
});

app.on404(({ url }) => {
  return {
    status: 404,
    message: `Route ${url} not found`,
    name: "NotFoundError",
  };
});

app.onError((err) => {
  return {
    status: err.status || 500,
    message: err.message || "Something went wrong",
    name: err.message || "InternalServerError",
  };
});

Deno.test("it should USE hello response Hello", async () => {
  await superdeno(handle)
    .get("/hello")
    .expect(200)
    .expect("Hello");
});
Deno.test("it should GET/res feature response", async () => {
  await superdeno(handle)
    .get("/res")
    .expect(200)
    .expect("content-type", "text/html")
    .expect("x-powered-by", "nhttp");
});
Deno.test("it should GET/ response Hello", async () => {
  await superdeno(handle)
    .get("/")
    .expect(200)
    .expect("Hello");
});
Deno.test("it should GET/async response Hello", async () => {
  await superdeno(handle)
    .get("/async")
    .expect(200)
    .expect("Hello");
});
Deno.test("it should GET/json response { name: 'john' }", async () => {
  await superdeno(handle)
    .get("/json")
    .expect(200)
    .expect("Content-Type", /^application/)
    .expect({ name: "john" });
});
Deno.test("it should GET/json2 response { name: 'john' }", async () => {
  await superdeno(handle)
    .get("/json2")
    .expect(200)
    .expect("Content-Type", /^application/)
    .expect("x-powered-by", "nhttp")
    .expect({ name: "john" });
});
Deno.test("it should GET/json/ response { name: 'john' }", async () => {
  await superdeno(handle)
    .get("/json/")
    .expect(200)
    .expect("Content-Type", /^application/)
    .expect({ name: "john" });
});
Deno.test("it should GET/users?name[firstName]=John&name[lastName]=Doe. with query", async () => {
  await superdeno(handle)
    .get("/users?name[firstName]=John&name[lastName]=Doe")
    .expect(200)
    .expect("Content-Type", /^application/)
    .expect({
      name: {
        firstName: "John",
        lastName: "Doe",
      },
    });
});
Deno.test("it should GET/users/:usersId/books/:bookId with params", async () => {
  await superdeno(handle)
    .get("/users/123/books/456")
    .expect(200)
    .expect("Content-Type", /^application/)
    .expect({ usersId: "123", bookId: "456" });
});
Deno.test("it should GET/image/:name.(jpg|png) with support params extension", async () => {
  await superdeno(handle)
    .get("/image/myfile.jpg")
    .expect(200)
    .expect("Content-Type", /^application/)
    .expect({ name: "myfile" });
});
Deno.test("it should GET/image/:name.(jpg|png) not match extension", async () => {
  await superdeno(handle)
    .get("/image/myfile.gif")
    .expect(404);
});
Deno.test("it should route support RegExp", async () => {
  await superdeno(handle)
    .get("/hello-world")
    .expect(200);
});
Deno.test("it should route not found GET/noop404", async () => {
  await superdeno(handle)
    .get("/noop404")
    .expect(404);
});
Deno.test("it should route GET/noop500 error", async () => {
  await superdeno(handle)
    .get("/noop500")
    .expect(500);
});
Deno.test("it should route POST via content-type application/json", async () => {
  await superdeno(handle)
    .post("/post")
    .set("Content-Type", "application/json")
    .set("Accept", "application/json")
    .send({
      name: {
        firstName: "John",
        lastName: "Doe",
      },
    })
    .expect(201)
    .expect({
      name: {
        firstName: "John",
        lastName: "Doe",
      },
    });
});
Deno.test("it should route POST via content-type application/x-www-form-urlencoded", async () => {
  await superdeno(handle)
    .post("/post")
    .set("Content-Type", "application/x-www-form-urlencoded")
    .set("Accept", "application/x-www-form-urlencoded")
    .send("name[firstName]=John&name[lastName]=Doe")
    .expect(201)
    .expect({
      name: {
        firstName: "John",
        lastName: "Doe",
      },
    });
});
Deno.test("it should route POST via content-type multipart/form-data", async () => {
  await superdeno(handle)
    .post("/post")
    .set("Accept", "multipart/form-data")
    .field("name[firstName]", "John")
    .field("name[lastName]", "Doe")
    .expect(201)
    .expect({
      name: {
        firstName: "John",
        lastName: "Doe",
      },
    });
});
Deno.test("it should route POST via content-type text/plain", async () => {
  await superdeno(handle)
    .post("/post")
    .set("Content-Type", "text/plain")
    .set("Accept", "text/plain")
    .send(JSON.stringify({
      name: {
        firstName: "John",
        lastName: "Doe",
      },
    }))
    .expect(201)
    .expect({
      name: {
        firstName: "John",
        lastName: "Doe",
      },
    });
});
Deno.test("it should middleware via expressMiddleware wrapper", async () => {
  const sub = new NHttp()
    .use(expressMiddleware([
      (_, res, next) => {
        res.set("name", "john");
        if (res.hasHeader("name")) {
          res.removeHeader("name");
        }
        res.setHeader("name", "john");
        res.set("name", res.get("name"));
        res.set("name", res.getHeader("name"));
        res.writeHead(200, { name: "john" });
        return next();
      },
      (req, res) => {
        if (req.url === "/") {
          return res.end("hello");
        } else {
          return req.respond({ body: "hello respond" });
        }
      },
    ] as EMidd[]));
  await superdeno(handleApp(sub))
    .get("/")
    .expect(200)
    .expect("name", "john")
    .expect("hello");
  await superdeno(handleApp(sub))
    .get("/hello")
    .expect(200)
    .expect("hello respond");
});
Deno.test("it should custom parseQuery", async () => {
  const sub = new NHttp({
    parseQuery: (str: string) =>
      Object.fromEntries(new URLSearchParams(str).entries()),
  })
    .get("/hello", ({ query }) => query);
  await superdeno(handleApp(sub))
    .get("/hello?name=john")
    .expect(200)
    .expect({ name: "john" });
});
Deno.test("it should multiple error", async () => {
  const sub = new NHttp()
    .use((_, next) => {
      return next(new Error("my error"));
    })
    .onError((err, { noop }) => {
      noop();
      return err.message || "hello";
    });
  await superdeno(handleApp(sub))
    .get("/hello")
    .expect(500)
    .expect(/noop/);
});
