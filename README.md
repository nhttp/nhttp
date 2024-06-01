<p align="center">
  <a href="https://github.com/nhttp/nhttp"><img height="200" style="height: 200px" src="https://raw.githubusercontent.com/nhttp/nhttp/master/dummy/logo.png" alt="logo"></a>
  <h1 align="center">NHttp</h1>
</p>
<p align="center">
An Simple web-framework for <a href="https://deno.land/">Deno</a> and Friends.
</p>
<hr/>

[![CI](https://github.com/nhttp/nhttp/workflows/ci/badge.svg)](https://github.com/nhttp/nhttp)
[![JSR](https://jsr.io/badges/@nhttp/nhttp)](https://jsr.io/@nhttp/nhttp)
[![JSR_SCORE](https://jsr.io/badges/@nhttp/nhttp/score)](https://jsr.io/@nhttp/nhttp/score)
[![CODECOV](https://codecov.io/gh/nhttp/nhttp/branch/master/graph/badge.svg?token=SJ2NZQ0ZJG)](https://codecov.io/gh/nhttp/nhttp)
[![DENO](https://img.shields.io/endpoint?url=https%3A%2F%2Fdeno-visualizer.danopia.net%2Fshields%2Flatest-version%2Fx%2Fnhttp%2Fmod.ts)](https://deno.land/x/nhttp)
[![MIT](https://img.shields.io/:license-mit-blue.svg)](http://badges.mit-license.org)
[![PRS](https://img.shields.io/badge/PRs-welcome-blue.svg)](http://makeapullrequest.com)

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

### JSR

```bash
// Deno
deno add @nhttp/nhttp

// npm
npx jsr add @nhttp/nhttp

// Yarn
yarn dlx jsr add @nhttp/nhttp

// pnpm
pnpm dlx jsr add @nhttp/nhttp

// Bun
bunx jsr add @nhttp/nhttp
```

### deno.land

```ts
import nhttp from "https://deno.land/x/nhttp/mod.ts";
```

## Simple Usage

Create file `app.ts` and copy-paste this code.

```ts
import nhttp from "@nhttp/nhttp";

const app = nhttp();

app.get("/", () => {
  return "Hello, World";
});

app.get("/cat", () => {
  return { name: "cat" };
});

app.listen(8000);
```

### Run

```bash
deno run -A app.ts
```

## Using JSX + Htmx

Create file `app.tsx` and copy-paste this code.

```jsx
import nhttp from "@nhttp/nhttp";
import { htmx, renderToHtml } from "@nhttp/nhttp/jsx";

const app = nhttp();

app.engine(renderToHtml);

app.use(htmx());

app.get("/", () => {
  return (
    <button hx-post="/clicked" hx-swap="outerHTML">
      Click Me
    </button>
  );
});

app.post("/clicked", () => {
  return <span>It's Me</span>;
});

app.listen(8000);
```

## config jsx

deno.json / tsconfig.json

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "@nhttp/nhttp/jsx"
  }
}
```

more docs => https://nhttp.deno.dev

## Standard Lib

Like `std-libs` for NHttp.

### Usage

```ts
// JSR
import {...} from "@nhttp/nhttp/my-libs";

// deno.land
import {...} from "https://deno.land/x/nhttp/lib/my-libs.ts";
```

### Serve Static

```ts
import nhttp from "@nhttp/nhttp";
import serveStatic from "@nhttp/nhttp/serve-static";

const app = nhttp();

app.use(serveStatic("./my_folder"));

// with prefix
app.use(serveStatic("./my_folder", { prefix: "/assets" }));
// or
// app.use("/assets", serveStatic("./my_folder"));

// with URL
app.use(serveStatic(new URL("./my_folder", import.meta.url)));
```

## CLI

### Deno

```bash
deno run -Ar npm:create-nhttp
```

### Npm

```bash
npm create nhttp@latest
```

## License

[MIT](LICENSE)
