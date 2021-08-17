<!-- // deno-fmt-ignore-file -->

## NHttp

[![License](https://img.shields.io/:license-mit-blue.svg)](http://badges.mit-license.org)
[![deno.land](https://img.shields.io/endpoint?url=https%3A%2F%2Fdeno-visualizer.danopia.net%2Fshields%2Flatest-version%2Fx%2Fnhttp@1.0.0%2Fmod.ts)](https://deno.land/x/nhttp)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-blue.svg)](http://makeapullrequest.com)
![deps badge](https://img.shields.io/endpoint?url=https%3A%2F%2Fdeno-visualizer.danopia.net%2Fshields%2Fdep-count%2Fhttps%2Fdeno.land%2Fx%2Fnhttp%2Fmod.ts)
![cache badge](https://img.shields.io/endpoint?url=https%3A%2F%2Fdeno-visualizer.danopia.net%2Fshields%2Fcache-size%2Fhttps%2Fdeno.land%2Fx%2Fnhttp%2Fmod.ts)
[![nest.land](https://nest.land/badge.svg)](https://nest.land/package/nhttp)

Fast native http framework for [Deno](https://deno.land/),
[Deno Deploy](https://deno.com/deploy) and
[Cloudflare Workers](https://workers.cloudflare.com).

> Note: Deno native HTTP/2 [Hyper](https://hyper.rs/) requires Deno version
> 1.9.0 or higher.

## Features

- HTTP/2 support.
- Middleware support.
- Router support.
- Includes body parser (jsonBody, urlencodedBody, rawBody, multipartBody).
- Return directly on handlers.
- No third party modules and no std/lib by default.
- Easy deploy to [Deno Deploy](https://deno.com/deploy) and
  [Cloudflare Workers](https://workers.cloudflare.com).

[See examples](https://github.com/nhttp/nhttp/tree/master/examples)

## Benchmark

Here the simple benchmark.

`autocannon -c 100 http://localhost:3000/hello`

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
import { NHttp } from "https://deno.land/x/nhttp@1.0.0/mod.ts";
```

### nest.land

```ts
import { NHttp } from "https://x.nest.land/nhttp@1.0.0/mod.ts";
```

## Usage

```ts
import { NHttp } from "https://deno.land/x/nhttp@1.0.0/mod.ts";

const app = new NHttp();

app.get("/", ({ response }) => {
  return response.send("Hello");
});

app.get("/json", ({ response }) => {
  return response.json({ name: "nhttp" });
});

// Return directly
app.get("/hello", () => {
  return "Hello World";
});

app.get("/hello/:name", ({ params }) => {
  return { name: params.name };
});

app.get("/nhttp", () => {
  return new Response("nhttp");
});

app.listen(3000, () => {
  console.log("> Running on port 3000");
});
```

## Run

```bash
deno run --allow-net yourfile.ts
```

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
- [ ] Unit Test

## License

[MIT](LICENSE)
