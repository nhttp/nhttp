<!-- // deno-fmt-ignore-file -->

<p align="center">
  <a href="https://github.com/nhttp/nhttp"><img height="200" style="height: 200px" src="https://raw.githubusercontent.com/nhttp/nhttp/master/dummy/logo.png" alt="logo"></a>
  <h1 align="center">NHttp</h1>
</p>
<p align="center">
An Simple http framework for <a href="https://deno.land/">Deno</a> and Friends.
</p>
<p align="center">
   <a href="https://github.com/nhttp/nhttp"><img src="https://github.com/nhttp/nhttp/workflows/ci/badge.svg" alt="ci" /></a>
   <a href="https://codecov.io/gh/nhttp/nhttp"><img src="https://codecov.io/gh/nhttp/nhttp/branch/master/graph/badge.svg?token=SJ2NZQ0ZJG" alt="coverage" /></a>
   <a href="https://www.codefactor.io/repository/github/nhttp/nhttp/overview/master"><img src="https://www.codefactor.io/repository/github/nhttp/nhttp/badge/master" alt="codefactor" /></a>
   <a href="https://deno.land/x/nhttp"><img src="https://img.shields.io/endpoint?url=https%3A%2F%2Fdeno-visualizer.danopia.net%2Fshields%2Flatest-version%2Fx%2Fnhttp@1.1.12%2Fmod.ts" alt="denoland" /></a>
   <a href="https://deno.land/x/nhttp"><img src="https://img.shields.io/endpoint?url=https%3A%2F%2Fdeno-visualizer.danopia.net%2Fshields%2Fdep-count%2Fhttps%2Fdeno.land%2Fx%2Fnhttp%2Fmod.ts" alt="deps" /></a>
   <a href="https://deno.land/x/nhttp"><img src="https://img.shields.io/endpoint?url=https%3A%2F%2Fdeno-visualizer.danopia.net%2Fshields%2Fcache-size%2Fhttps%2Fdeno.land%2Fx%2Fnhttp%2Fmod.ts" alt="size" /></a>
   <a href="http://badges.mit-license.org"><img src="https://img.shields.io/:license-mit-blue.svg" alt="licence" /></a>
   <a href="http://makeapullrequest.com"><img src="https://img.shields.io/badge/PRs-welcome-blue.svg" alt="prs" /></a>
</p>
<hr/>

## Features

- Simple Performance.
- Middleware support.
- Router support.
- Handle support.
- Includes body parser (json, urlencoded, raw, multipart).
- Return directly on handlers.
- Express middleware compatibility.

[See examples](https://github.com/nhttp/nhttp/tree/master/examples)

## Installation

### deno.land

```ts
import { nhttp } from "https://deno.land/x/nhttp@1.1.12/mod.ts";
```

### npm/yarn

```bash
npm i nhttp-land

// or

yarn add nhttp-land
```

## Usage

```ts
import { nhttp } from "https://deno.land/x/nhttp@1.1.12/mod.ts";

const app = nhttp();

app.get("/", (rev) => {
  return "Hello, World";

  // or
  // return { hello: "world" };
  // return new Response("Hello, World");
  // rev.response.send("Hello, World");
});

app.listen(8000, () => {
  console.log("> Running on port 8000");
});
```

METHOD => `get | post | put | patch | delete | any | head | options`.

app[METHOD](path: string | RegExp, (rev: RequestEvent) => { // code });

// or app[METHOD](path: string | RegExp, ...handlers);

## Run

```bash
deno run --allow-net yourfile.ts
```

## Route Paths

```ts
...

// normal path
app.get("/", () => {...});

// with parameter
app.get("/users/:userId/books/:bookId", (rev) => {
  return rev.params;
});

// with query. /users?name=john&foo[bar]=baz
app.get("/users", (rev) => {
  return rev.query;
});

// with optional parameter. match for /books and /books/bookname 
app.get("/books/:name?", (rev) => {
  return rev.params;
});

// with extension. match for .png and .jpg only
app.get("/image/:filename.(png|jpg)", (rev) => {
  return rev.params;
});

// exact/wild. /users/123
app.any("*", (rev) => {
  return rev.params;
  // => { wild: ["users", "123"] }
});

// exact wild named slug. /users/123
app.any("/:slug*", (rev) => {
  return rev.params;
  // => { slug: ["users", "123"] }
});

// RegExp. match for path includes hello.
app.get(/hello/, (rev) => {
  return rev.path;
});

// RegExp. match for path endsWith ball. ex: /dragonball and /football
app.get(/.*ball$/, (rev) => {
  return rev.path;
});

...
```

## Custom Server

```ts
import { serve } from "https://deno.land/std@0.119.0/http/server.ts";
import { nhttp } from "https://deno.land/x/nhttp@1.1.12/mod.ts";

const app = nhttp();

app.get("/", () => {
  return "hello custom";
});

await serve(app.handle);

// or Deno Flash
// await Deno.serve(app.handle);
```

## Bun

```ts
import { nhttp } from "nhttp-land";

const app = nhttp();

app.get("/", ({ response }) => {
  return "hello bun";
});

Bun.serve({ fetch: app.handle });
```

## CF Workers

```ts
import { nhttp } from "nhttp-land";

const app = nhttp();

app.get("/", ({ response }) => {
  return "hello cfw";
});

export default { fetch: app.handle };
```

## Middleware

`app.use(...handlers)` or `app.use([fn1, fn2])`

```ts
import { nhttp } from "https://deno.land/x/nhttp@1.1.12/mod.ts";

const app = nhttp();

app.use((rev, next) => {
  rev.foo = "foo";
  return next();
});

app.get("/", (rev) => {
  return rev.foo;
});

app.listen(8000);
```

### Express Middleware

> not all are supported

```ts
import { nhttp } from "https://deno.land/x/nhttp@1.1.12/mod.ts";
import helmet from "npm:helmet";

const app = nhttp();

app.use(helmet());

app.get("/", () => {
  return "hello with helmet";
});

app.listen(8000);
```

## Header

Example cors in middleware

```ts
import { nhttp } from "https://deno.land/x/nhttp@1.1.12/mod.ts";

const app = nhttp();

app.use(({ response, request }, next) => {
  // example header
  response.header({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*",
    "Access-Control-Allow-Headers": "*",
  });
  if (request.method === "OPTIONS") {
    return response.send();
  }
  return next();
});

app.get("/", () => {
  return "Hello world with cors";
});

app.listen(8000);
```

## Status Code

```ts
import { nhttp } from "https://deno.land/x/nhttp@1.1.12/mod.ts";

const app = nhttp();

// post with status 201
app.post("/", ({ response }) => {
  // set status
  response.status(201);

  // get status
  const status = response.status();
  console.log("current status is " + status);

  return "Hello from status " + status;
});

app.listen(8000);
```

## Body

Support json, urlencoded, multipart, raw.

```ts
import { nhttp } from "https://deno.land/x/nhttp@1.1.12/mod.ts";

const app = nhttp();

app.post("/save", ({ body }) => {
  return body;
});

app.listen(8000);
```

## Upload

Simple multipart upload.

```ts
import { multipart, nhttp } from "https://deno.land/x/nhttp@1.1.12/mod.ts";

const upload = multipart.upload({
  // required field name
  name: "image",
  dest: "public/images/",

  // optionals
  accept: "png|jpg",
  maxSize: "2 mb",
  required: true,
});

const app = nhttp();

app.post("/upload", upload, ({ body, file }) => {
  console.log(file.image);
  console.log(body);
  return "Success upload";
});

app.listen(8000);
```

## Upload With Bun

Simple multipart upload with Bun.

```ts
import { multipart, nhttp } from "nhttp-land";

const upload = multipart.upload({
  // required field name
  name: "image",
  dest: "public/images/",

  // optionals
  accept: "png|jpg",
  maxSize: "2 mb",
  required: true,

  // custom write file
  writeFile: Bun.write,
});

const app = nhttp();

app.post("/upload", upload, ({ body, file }) => {
  console.log(file.image);
  console.log(body);
  return "Success upload";
});

Bun.serve({ fetch: app.handle });
```

## Sub Router

`app.use(router | router[])` or `app.use(basePath, router | router[])`

```ts
import { nhttp, Router } from "https://deno.land/x/nhttp@1.1.12/mod.ts";

//user router example with base
const user = new Router({ base: "/user" }); // base optional
user.get("/", ...handlers);

//item router example without base
const item = new Router();
item.get("/item", ...handlers);

const app = nhttp();

// register router
app.use("/api/v1", [user, item]);

...
```

## RequestEvent & Types

```ts
import { nhttp, Router } from "https://deno.land/x/nhttp@1.1.12/mod.ts";

const app = nhttp();

type TUser = {
  token: string;
};

app.use<TUser>((rev, next) => {
  // rev.token must be string.
  rev.token = "1234";
  return next();
});

app.get<TUser>("/hello", ({ token }) => {
  return token;
});

...
```

## License

[MIT](LICENSE)
