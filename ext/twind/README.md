## Lib twind

> this libs for [@nhttp/nhttp/jsx](https://jsr.io/@nhttp/nhttp).

## Usage

### twind server

```tsx
import { type FC, renderToHtml } from "@nhttp/nhttp/jsx";
import { useTwindServer } from "@nhttp/twind/server";
import nhttp from "@nhttp/nhttp";

useTwindServer();

const app = nhttp();

app.engine(renderToHtml);

app.get("/", () => <h1 className="mt-20">hello twind</h1>);

app.listen(8000, () => {
  console.log("> Running on port 8000");
});
```

### twind stream

```tsx
import { type FC, renderToReadableStream } from "@nhttp/nhttp/jsx";
import { useTwindStream } from "@nhttp/twind/server";
import nhttp from "@nhttp/nhttp";

useTwindStream();

const app = nhttp();

app.engine(renderToReadableStream);

app.get("/", () => <h1 className="mt-20">hello twind</h1>);

app.listen(8000, () => {
  console.log("> Running on port 8000");
});
```

### twind cdn

```tsx
import { type FC, renderToHtml } from "@nhttp/nhttp/jsx";
import { twind } from "@nhttp/twind";
import nhttp from "@nhttp/nhttp";

const app = nhttp();

app.engine(renderToHtml);

app.use(twind());

app.get("/", () => <h1 className="mt-20">hello twind</h1>);

app.listen(8000, () => {
  console.log("> Running on port 8000");
});
```
