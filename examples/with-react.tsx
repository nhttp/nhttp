import { NHttp, RequestEvent } from "../mod.ts";
// @deno-types="npm:@types/react"
import React, { ReactElement } from "npm:react";
// @deno-types="npm:@types/react-dom/server"
import { renderToString } from "npm:react-dom/server";

type MyApp = RequestEvent & {
  jsx: (el: ReactElement) => Response;
};

const app = new NHttp<MyApp>();

app.use((rev, next) => {
  rev.jsx = (el) => {
    rev.response.type("html");
    return renderToString(el);
  };
  return next();
});

app.get("/", ({ jsx }) => {
  return jsx(<h1>Hello from react</h1>);
});

app.listen(8000, (_err, info) => {
  console.log(`Running on port ${info?.port}`);
});
