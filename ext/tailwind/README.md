## Lib Tailwind

> this libs for [@nhttp/nhttp](https://jsr.io/@nhttp/nhttp)

## Using Middleware

```tsx
import nhttp from "@nhttp/nhttp";
import { renderToHtml } from "@nhttp/nhttp/jsx";
import tailwind from "@nhttp/tailwind";

const app = nhttp();

const tw = await tailwind(app, {
  content: ["./src/**/*.tsx"],
  minify: isProduction,
});

app.engine(renderToHtml).use(tw);

app.get("/", () => {
  return <div className="text-4xl mt-10">Hello Tailwind</div>;
});

app.listen(8000);
```

## Using Builder

Create file `input.css` and add the `@tailwind` directives for each of
Tailwind’s layers to your main CSS file.

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Create file `tailwind.ts` and use `build`.

```tsx
import { build } from "@nhttp/tailwind";

// example using `args`. but, you can use `env` instead of args.
const isDev = Deno.args.includes("--dev");
const isBuild = Deno.args.includes("--build");

if (isDev || isBuild) {
  await build({
    input: "./input.css",
    output: "./public/css/style.css",
    content: ["./src/**/*.tsx"],
    minify: isBuild,
  });
}
```

Create file `app.tsx` and import `tailwind.ts`.

```tsx
import nhttp from "@nhttp/nhttp";
import { Helmet, renderToHtml } from "@nhttp/nhttp/jsx";
import serveStatic from "@nhttp/nhttp/serve-static";

// import tailwind.ts
import "./tailwind.ts";

const app = nhttp();

app.use("/assets", serveStatic("public", { etag: true }));

app.engine(renderToHtml);

app.get("/", () => {
  return (
    <>
      <Helmet>
        <link rel="stylesheet" href="/assets/css/style.css" />
      </Helmet>
      <div className="text-4xl mt-10">Hello Tailwind</div>
    </>
  );
});

app.listen(8000);
```

Create file `deno.json`.

```json
{
  "tasks": {
    "dev": "deno run -A --watch app.tsx --dev",
    "build:tailwind": "deno run -A tailwind.ts --build",
    "start": "deno run -A app.tsx"
  }
}
```

> Don't forget. before release to prod, you must run `build:tailwind`.
