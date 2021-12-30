<!-- // deno-fmt-ignore-file -->

## NHttp

[![License](https://img.shields.io/:license-mit-blue.svg)](http://badges.mit-license.org)
[![deno.land](https://img.shields.io/endpoint?url=https%3A%2F%2Fdeno-visualizer.danopia.net%2Fshields%2Flatest-version%2Fx%2Fnhttp@1.1.2%2Fmod.ts)](https://deno.land/x/nhttp)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-blue.svg)](http://makeapullrequest.com)
![deps badge](https://img.shields.io/endpoint?url=https%3A%2F%2Fdeno-visualizer.danopia.net%2Fshields%2Fdep-count%2Fhttps%2Fdeno.land%2Fx%2Fnhttp%2Fmod.ts)
![cache badge](https://img.shields.io/endpoint?url=https%3A%2F%2Fdeno-visualizer.danopia.net%2Fshields%2Fcache-size%2Fhttps%2Fdeno.land%2Fx%2Fnhttp%2Fmod.ts)
[![nest.land](https://nest.land/badge.svg)](https://nest.land/package/nhttp)

Fast http framework for [Deno](https://deno.land/),
[Deno Deploy](https://deno.com/deploy) and
[Cloudflare Workers](https://workers.cloudflare.com).

> Note: Deno native HTTP/2 [Hyper](https://hyper.rs/) requires Deno version
> 1.9.0 or higher.

## Features

- HTTP/2 support.
- Middleware support.
- Router support.
- Includes body parser (json, urlencoded, raw, multipart).
- Return directly on handlers.
- No third party modules and no std/lib by default.
- Easy deploy to [Deno Deploy](https://deno.com/deploy) and
  [Cloudflare Workers](https://workers.cloudflare.com).

[See examples](https://github.com/nhttp/nhttp/tree/master/examples)

## Benchmark

Here the simple benchmark.

`autocannon -c 100 http://localhost:8080/hello`

| Name     | Req/sec | Throughput |
| -------- | ------- | ---------- |
| Native   | 21433   | 2.5 MB     |
| NHttp    | 21127   | 2.5 MB     |
| std/http | 14569   | 626 KB     |

> Note: maybe not relevant if compared with std/http or other Deno framework
> using std/http. nhttp uses native deno http.

for cloudflare workers visit =>
https://nhttp.deno.dev/docs/usage/cloudflare-workers

## Installation

### deno.land

```ts
import { NHttp } from "https://deno.land/x/nhttp@1.1.2/mod.ts";
```

### nest.land

```ts
import { NHttp } from "https://x.nest.land/nhttp@1.1.2/mod.ts";
```

## Usage

```ts
import { NHttp } from "https://deno.land/x/nhttp@1.1.2/mod.ts";

const app = new NHttp();

app.get("/", (rev) => {
  return "Hello World";
  // return { name: "john" };
  // return new Response("Hello World");
  // return rev.response.send("Hello World");
});

app.listen(8080, () => {
  console.log("> Running on port 8080");
});
```

METHOD => `get | post | put | patch | delete | any | head | options`.

app[METHOD](path: string, ...handlers)

## Run

```bash
deno run --allow-net yourfile.ts
```

## Middleware Example

`app.use(...handlers)` or `app.use([fn1, fn2])`

```ts
import { NHttp } from "https://deno.land/x/nhttp@1.1.2/mod.ts";

new NHttp()
  .use((rev, next) => {
    rev.foo = "foo";
    return next();
  })
  .get("/", ({ foo }) => {
    return foo;
  })
  .listen(8080);
```

## Router Example

`app.use(router | router[])` or `app.use(basePath, router | router[])`

```ts
import { NHttp, Router } from "https://deno.land/x/nhttp@1.1.2/mod.ts";

//user router example with base
const user = new Router({ base: "/user" }); // base optional
user.get("/", ...handlers);
user.get("/:id", ...handlers);
user.post("/", ...handlers);
user.put("/:id", ...handlers);
user.delete("/:id", ...handlers);

//item router example without base
const item = new Router();
item.get("/item", ...handlers);
item.get("/item/:id", ...handlers);
item.post("/item", ...handlers);
item.put("/item/:id", ...handlers);
item.delete("/item/:id", ...handlers);

new NHttp()
  // register router
  .use("/api/v1", [user, item])
  .listen(8080);
```

now, you can access with http://localhost:8080/api/v1/user

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
