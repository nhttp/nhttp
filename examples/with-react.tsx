import nhttp from "../mod.ts";
// @deno-types="npm:@types/react"
import React from "npm:react";
// @deno-types="npm:@types/react-dom/server"
import { renderToString } from "npm:react-dom/server";

const app = nhttp();

app.engine(renderToString);

app.get("/", async ({ response }) => {
  await response.render(<h1>Hello World</h1>);
});

app.listen(8000, (_err, info) => {
  console.log(`Running on port ${info.port}`);
});
