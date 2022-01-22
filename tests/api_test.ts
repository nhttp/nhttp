import { superdeno } from "https://deno.land/x/superdeno@4.7.2/mod.ts";
import { TObject } from "../src/types.ts";
import {
  expressMiddleware,
  JsonResponse,
  NextFunction,
  NHttp,
  Router,
} from "./../mod.ts";

type EMidd = (
  req: TObject,
  res: TObject,
  next: NextFunction,
) => void | Promise<void>;

const sleep = (ms: number) => new Promise((ok) => setTimeout(ok, ms));

const handleApp = (app: NHttp) =>
  (request: Request) => app.handleEvent({ request });

Deno.test("Route response", async (t) => {
  const app = new NHttp();
  app.use("/hello", () => "hello");
  app.get("/text", () => "text");
  app.get("/json", () => ({ name: "john" }));
  app.get("/json-response", () =>
    new JsonResponse({ name: "john" }, {
      headers: new Headers({
        "x-powered-by": "nhttp",
      }),
    }));
  app.get("/async", async () => {
    await sleep(1000);
    return "hello";
  });
  app.get("/form", () => {
    const form = new FormData();
    form.append("name", "john");
    return form;
  });
  app.on("GET", "/with-on", () => "hello");
  await t.step("use /hello", async () => {
    await superdeno(handleApp(app))
      .get("/hello")
      .expect(200)
      .expect("hello");
  });
  await t.step("get /text", async () => {
    await superdeno(handleApp(app))
      .get("/text")
      .expect(200)
      .expect("text");
  });
  await t.step("get /async", async () => {
    await superdeno(handleApp(app))
      .get("/async")
      .expect(200)
      .expect("hello");
  });
  await t.step("get /json", async () => {
    await superdeno(handleApp(app))
      .get("/json")
      .expect(200)
      .expect({ name: "john" });
  });
  await t.step("get /json/", async () => {
    await superdeno(handleApp(app))
      .get("/json/")
      .expect(200)
      .expect({ name: "john" });
  });
  await t.step("get /json-response", async () => {
    await superdeno(handleApp(app))
      .get("/json-response")
      .expect(200)
      .expect({ name: "john" });
  });
  await t.step("get /form", async () => {
    await superdeno(handleApp(app))
      .get("/form")
      .expect(200);
  });
  await t.step("get /with-on", async () => {
    await superdeno(handleApp(app))
      .get("/with-on")
      .expect(200)
      .expect("hello");
  });
});

Deno.test("Route params and query", async (t) => {
  const app = new NHttp();
  app.get("/users", ({ query }) => query);
  app.get("/users/:id", ({ params }) => params);
  app.get("/image/:filename.(png|jpg)", ({ params }) => params);
  await t.step("Params users/:id", async () => {
    await superdeno(handleApp(app))
      .get("/users/123")
      .expect(200)
      .expect({ id: "123" });
  });
  await t.step("Params /image/:filename.(png|jpg)", async () => {
    await superdeno(handleApp(app))
      .get("/image/myfile.png")
      .expect(200)
      .expect({ filename: "myfile" });
  });
  await t.step("Params /image/:filename.(png|jpg) not match", async () => {
    await superdeno(handleApp(app))
      .get("/image/myfile.gif")
      .expect(404);
  });
  await t.step("Query /users?name=john", async () => {
    await superdeno(handleApp(app))
      .get("/users?name=john")
      .expect(200)
      .expect({ name: "john" });
  });
  await t.step("Query /users?name=john&name=doe", async () => {
    await superdeno(handleApp(app))
      .get("/users?name=john&name=doe")
      .expect(200)
      .expect({ name: ["john", "doe"] });
  });
  await t.step(
    "Query /users?name[first_name]=john&name[last_name]=doe",
    async () => {
      await superdeno(handleApp(app))
        .get("/users?name[first_name]=john&name[last_name]=doe")
        .expect(200)
        .expect({
          name: {
            first_name: "john",
            last_name: "doe",
          },
        });
    },
  );
  await t.step(
    "Query /users?location[][lat]=123&location[][lat]=456",
    async () => {
      await superdeno(handleApp(app))
        .get("/users?location[][lat]=123&location[][lat]=456")
        .expect(200)
        .expect({
          location: [
            { lat: "123" },
            { lat: "456" },
          ],
        });
    },
  );
});

Deno.test("Feature app and response", async (t) => {
  const app = new NHttp({
    env: "production",
    bodyLimit: {
      json: "2mb",
      urlencoded: "2mb",
      raw: "2mb",
      multipart: "100mb",
    },
    parseQuery: (str: string) => ({ noop: str }),
  });
  app.get("/hello", ({ response, getCookies }) => {
    response.type("text/html");
    response.header("x-powered-by", "nhttp");
    response.header({ "name": "john" });
    response.header(new Headers({ "name1": "john" }));
    response.cookie("key", "value", { encode: true });
    response.cookie("key1", { "no": "1" });
    response.clearCookie("key");
    const status = response.status();
    response.status(status as number);
    return getCookies(true) || {};
  });
  app.get("/redirect", ({ response }) => response.redirect("/hello"));
  app.get("/users", ({ query }) => query);
  app.get(/\/yes/, () => "yes");
  app.get("/error", ({ noop }) => {
    noop();
    return "noop";
  });
  await t.step("get /yes-yes (RegExp)", async () => {
    await superdeno(handleApp(app))
      .get("/yes-yes")
      .expect(200)
      .expect("yes");
  });
  await t.step("get /hello", async () => {
    await superdeno(handleApp(app))
      .get("/hello")
      .expect(200);
  });
  await t.step("get /redirect", async () => {
    await superdeno(handleApp(app))
      .get("/redirect")
      .expect(302);
  });
  await t.step("get /users?name=john", async () => {
    await superdeno(handleApp(app))
      .get("/users?name=john")
      .expect(200)
      .expect({ noop: "name=john" });
  });
  await t.step("error without stack on prod", async () => {
    await superdeno(handleApp(app))
      .get("/error")
      .expect(500)
      .expect({
        status: 500,
        message: "noop is not a function",
        name: "TypeError",
      });
  });
});

Deno.test("Error handling", async (t) => {
  const app = new NHttp();
  app.get("/error", ({ noop }) => {
    noop();
    return "noop";
  });
  app.onError((err) => {
    return err.message;
  });
  app.on404(({ url }) => {
    return url + " 404 not found";
  });
  await t.step("Noop is not a function", async () => {
    await superdeno(handleApp(app))
      .get("/error")
      .expect(500)
      .expect("noop is not a function");
  });
  await t.step("Url /hello 404 not found", async () => {
    await superdeno(handleApp(app))
      .get("/hello")
      .expect(404)
      .expect("/hello 404 not found");
  });
});
Deno.test("Body parser", async (t) => {
  const app = new NHttp();
  app.post("/", ({ body, response }) => {
    response.status(201);
    return body;
  });

  await t.step("jsonBody", async () => {
    await superdeno(handleApp(app))
      .post("/")
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
  await t.step("urlencodedBody", async () => {
    await superdeno(handleApp(app))
      .post("/")
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
  await t.step("multipartBody", async () => {
    await superdeno(handleApp(app))
      .post("/")
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
  await t.step("rawBody", async () => {
    await superdeno(handleApp(app))
      .post("/")
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
  await t.step("rawBody not json", async () => {
    await superdeno(handleApp(app))
      .post("/")
      .set("Content-Type", "text/plain")
      .set("Accept", "text/plain")
      .send("my name john")
      .expect(201)
      .expect({ _raw: "my name john" });
  });
});
Deno.test("Middleware and sub router", async (t) => {
  const users = new Router({ base: "/users" });
  users.get("/", ({ foo, bar, foobar }) => {
    return foo + bar + (foobar || "");
  });

  const items = new Router();
  items.get("/items", ({ foo, bar, foobar }) => {
    return foo + bar + (foobar || "");
  });

  const books = new Router({ base: "/" });
  books.get("/books", ({ foo, bar, foobar }) => {
    return foo + bar + (foobar || "");
  });
  const app = new NHttp();

  // global middleware
  app.use((rev, next) => {
    rev.foo = "foo";
    return next();
  }, (rev, next) => {
    rev.bar = "bar";
    return next();
  });

  // router middleware
  app.use("/api/v1", (rev, next) => {
    rev.foobar = "foobar";
    return next();
  }, [users, items]);
  app.use("/api/v1", books);

  app.get("/foobar", ({ foo, bar, foobar }) => {
    return foo + bar + (foobar || "");
  });

  await t.step("get only /foobar", async () => {
    await superdeno(handleApp(app))
      .get("/foobar")
      .expect(200)
      .expect("foobar");
  });
  await t.step("get /api/v1/users", async () => {
    await superdeno(handleApp(app))
      .get("/api/v1/users")
      .expect(200)
      .expect("foobarfoobar");
  });
  await t.step("get /api/v1/items", async () => {
    await superdeno(handleApp(app))
      .get("/api/v1/items")
      .expect(200)
      .expect("foobarfoobar");
  });
  await t.step("get /api/v1/books", async () => {
    await superdeno(handleApp(app))
      .get("/api/v1/books")
      .expect(200)
      .expect("foobar");
  });
});

Deno.test("Middleware via expressMiddleware wrapper", async () => {
  const app = new NHttp()
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
  await superdeno(handleApp(app))
    .get("/")
    .expect(200)
    .expect("name", "john")
    .expect("hello");
  await superdeno(handleApp(app))
    .get("/hello")
    .expect(200)
    .expect("hello respond");
});

Deno.test("Multiple error", async () => {
  const app = new NHttp()
    .use((_, next) => {
      return next(new Error("my error"));
    })
    .onError((err, { noop }) => {
      noop();
      return err.message || "hello";
    });
  await superdeno(handleApp(app))
    .get("/hello")
    .expect(500)
    .expect(/noop/);
});
