<!-- // deno-fmt-ignore-file -->

<p align="center">
  <a href="https://github.com/nhttp/nhttp"><img height="200" style="height: 200px" src="https://raw.githubusercontent.com/nhttp/nhttp/master/dummy/logo.png" alt="logo"></a>
  <h1 align="center">NHttp</h1>
</p>
<p align="center">
An Simple web-framework for <a href="https://deno.land/">Deno</a> and Friends.
</p>
<p align="center">
   <a href="https://github.com/nhttp/nhttp"><img src="https://github.com/nhttp/nhttp/workflows/ci/badge.svg" alt="ci" /></a>
   <a href="https://codecov.io/gh/nhttp/nhttp"><img src="https://codecov.io/gh/nhttp/nhttp/branch/master/graph/badge.svg?token=SJ2NZQ0ZJG" alt="coverage" /></a>
   <a href="https://www.codefactor.io/repository/github/nhttp/nhttp/overview/master"><img src="https://www.codefactor.io/repository/github/nhttp/nhttp/badge/master" alt="codefactor" /></a>
   <a href="https://deno.land/x/nhttp"><img src="https://img.shields.io/endpoint?url=https%3A%2F%2Fdeno-visualizer.danopia.net%2Fshields%2Flatest-version%2Fx%2Fnhttp@1.2.23%2Fmod.ts" alt="denoland" /></a>
   <a href="https://deno.land/x/nhttp"><img src="https://img.shields.io/endpoint?url=https%3A%2F%2Fdeno-visualizer.danopia.net%2Fshields%2Fdep-count%2Fhttps%2Fdeno.land%2Fx%2Fnhttp@1.2.24%2Fmod.ts" alt="deps" /></a>
   <a href="https://deno.land/x/nhttp"><img src="https://img.shields.io/bundlephobia/minzip/nhttp-land" alt="size" /></a>
   <a href="https://deno.land/x/nhttp"><img src="https://img.shields.io/bundlephobia/min/nhttp-land" alt="size" /></a>
   <a href="http://badges.mit-license.org"><img src="https://img.shields.io/:license-mit-blue.svg" alt="licence" /></a>
   <a href="http://makeapullrequest.com"><img src="https://img.shields.io/badge/PRs-welcome-blue.svg" alt="prs" /></a>
   <a href="https://nest.land/package/nhttp"><img src="https://nest.land/badge.svg" alt="nestland" /></a>
</p>
<hr/>

## Features

- Focus on simple and easy to use.
- Fast Performance.
  [One of the fastest Frameworks](https://github.com/denosaurs/bench#hello-bench).
- Cross runtime support (Deno, Node, Bun, etc).
- Low overhead & True handlers (no caching anything).
- Built-in Middleware.
- Sub router support.
- Template engine support (jsx, ejs, nunjucks, eta, pug, ..etc).
- Return directly on handlers.
- Auto parses the body (`json / urlencoded / multipart / raw`).

[See Examples](https://github.com/nhttp/nhttp/tree/master/examples)

## Installation

### deno.land

```ts
import nhttp from "https://deno.land/x/nhttp/mod.ts";
```

### deno-npm

```ts
import nhttp from "npm:nhttp-land";
```

### npm/yarn

```bash
npm i nhttp-land

// or

yarn add nhttp-land
```

```ts
// module
import nhttp from "nhttp-land";

// commonjs
const nhttp = require("nhttp-land").default;
```

## Usage

Create file `app.ts` and copy-paste code.

```ts
import nhttp from "https://deno.land/x/nhttp/mod.ts";

const app = nhttp();

app.get("/", () => {
  return "Hello, World";
});

app.get("/cat", () => {
  return { name: "cat" };
});

app.listen(8000, (err, info) => {
  if (err) throw err;
  console.log(`> Running on port ${info.port}`);
});
```

## Run

```bash
deno run --allow-net app.ts
```

more docs => https://nhttp.deno.dev

## License

[MIT](LICENSE)
