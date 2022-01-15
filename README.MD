<!-- // deno-fmt-ignore-file -->

## NHttp

[![License](https://img.shields.io/:license-mit-blue.svg)](http://badges.mit-license.org)
[![deno.land](https://img.shields.io/endpoint?url=https%3A%2F%2Fdeno-visualizer.danopia.net%2Fshields%2Flatest-version%2Fx%2Fnhttp@1.1.6%2Fmod.ts)](https://deno.land/x/nhttp)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-blue.svg)](http://makeapullrequest.com)
![deps badge](https://img.shields.io/endpoint?url=https%3A%2F%2Fdeno-visualizer.danopia.net%2Fshields%2Fdep-count%2Fhttps%2Fdeno.land%2Fx%2Fnhttp%2Fmod.ts)
![cache badge](https://img.shields.io/endpoint?url=https%3A%2F%2Fdeno-visualizer.danopia.net%2Fshields%2Fcache-size%2Fhttps%2Fdeno.land%2Fx%2Fnhttp%2Fmod.ts)
[![nest.land](https://nest.land/badge.svg)](https://nest.land/package/nhttp)

An Simple http framework for [Deno](https://deno.land/),
[Deno Deploy](https://deno.com/deploy) and
[Cloudflare Workers](https://workers.cloudflare.com).

> Note: Deno native HTTP/2 [Hyper](https://hyper.rs/) requires Deno version
> 1.9.0 or higher.

## Features

- Fast. see [benchmarks](https://github.com/herudi/deno_benchmarks#output).
- HTTP/2 support.
- Middleware support.
- Router support.
- Includes body parser (json, urlencoded, raw, multipart).
- Return directly on handlers.
- No third party modules and no std/lib by default.
- Easy deploy to [Deno Deploy](https://deno.com/deploy) and
  [Cloudflare Workers](https://workers.cloudflare.com).

[See examples](https://github.com/nhttp/nhttp/tree/master/examples)

for cloudflare workers visit =>
https://nhttp.deno.dev/docs/usage/cloudflare-workers

## Installation

### deno.land

```ts
import { NHttp } from "https://deno.land/x/nhttp@1.1.6/mod.ts";
```

### nest.land

```ts
import { NHttp } from "https://x.nest.land/nhttp@1.1.6/mod.ts";
```

## Usage

```ts
import { NHttp } from "https://deno.land/x/nhttp@1.1.6/mod.ts";

const app = new NHttp();

app.get("/", (rev) => {
  return rev.response.send("Hello World");

  // or
  // return "Hello World";
  // return { name: "john" };
  // return new Response("Hello World");
});

app.listen(8080, () => {
  console.log("> Running on port 8080");
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
import { NHttp } from "https://deno.land/x/nhttp@1.1.6/mod.ts";

const app = new NHttp();

app.get("/", ({ response }) => {
  return response.send("Hello Custom");
});

serve((request, conn) => app.handleEvent({ request, conn }));
```

## Middleware Example

`app.use(...handlers)` or `app.use([fn1, fn2])`

```ts
import { NHttp } from "https://deno.land/x/nhttp@1.1.6/mod.ts";

const app = new NHttp();

app.use((rev, next) => {
  rev.foo = "foo";
  return next();
});

app.get("/", (rev) => {
  return rev.foo;
});

app.listen(8080);
```

## Header

Example cors in middleware

```ts
import { NHttp } from "https://deno.land/x/nhttp@1.1.6/mod.ts";

const app = new NHttp();

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

app.listen(8080);
```

## Status Code

```ts
import { NHttp } from "https://deno.land/x/nhttp@1.1.6/mod.ts";

const app = new NHttp();

// post with status 201
app.post("/", ({ response }) => {
  // set status
  response.status(201);

  // get status
  const status = response.status();
  console.log("The current status is " + status);

  return "Hello from status " + status;
});

app.listen(8080);
```

## Body

Support json, urlencoded, multipart, raw.

```ts
import { NHttp } from "https://deno.land/x/nhttp@1.1.6/mod.ts";

const app = new NHttp();

app.post("/save", ({ body }) => {
  return body;
});

app.listen(8080);
```

## Upload

Simple multipart upload.

> requires --allow-read --allow-write

```ts
import { multipart, NHttp } from "https://deno.land/x/nhttp@1.1.6/mod.ts";

const upload = multipart.upload({
  // required field name
  name: "image",
  dest: "public/images/",

  // optionals
  accept: "png|jpg",
  maxSize: "2 mb",
  required: true,
});

const app = new NHttp();

app.post("/upload", upload, ({ body, file }) => {
  console.log(file.image);
  console.log(body);
  return "Success upload";
});

app.listen(8080);
```

## Router Example

`app.use(router | router[])` or `app.use(basePath, router | router[])`

```ts
import { NHttp, Router } from "https://deno.land/x/nhttp@1.1.6/mod.ts";

//user router example with base
const user = new Router({ base: "/user" }); // base optional
user.get("/", ...handlers);

//item router example without base
const item = new Router();
item.get("/item", ...handlers);

new NHttp()
  // register router
  .use("/api/v1", [user, item])
  .listen(8080);
```

now, you can access with http://localhost:8080/api/v1/user

## Usage With Controller

```ts
import { NHttp } from "https://deno.land/x/nhttp@1.1.6/mod.ts";

import {
  addControllers,
  BaseController,
  Controller,
  Get,
  Post,
  Status,
} from "https://deno.land/x/nhttp_controller@0.7.0/mod.ts";

@Controller("/user")
class UserController extends BaseController {
  @Get()
  findAll() {
    return { name: "john" };
  }

  @Get("/:id")
  findById() {
    const { params } = this.requestEvent;
    return params;
  }

  @Status(201)
  @Post()
  save() {
    const { body } = this.requestEvent;
    return body;
  }
}

class Application extends NHttp {
  constructor() {
    super();
    const controllers = addControllers([UserController]);
    this.use("/api/v1", controllers);
  }
}

new Application().listen(8080);
```

visit http://localhost:8080/api/v1/user

## Full Documentation NHttp

https://nhttp.deno.dev

or

https://nhttp.herudi.workers.dev

### Want to contribute to this project? I gladly welcome it.

- Please _**fork**_.
- Create a _**branch**_.
- _**Commit**_ changes (before commit, please format the code with the command
  `deno fmt` in the src folder).
- Push to the created _**branch**_.
- Make a _**PR (Pull Requests)**_.
- Thanks.

## List

- [x] Server App
- [x] Middleware
- [x] Router
- [x] Body Parser
- [x] Examples
- [x] Doc
- [x] Deno lint
- [x] Unit Test

## License

[MIT](LICENSE)
