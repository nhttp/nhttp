import { NHttp } from "../mod.ts";
import * as React from "https://jspm.dev/react@17.0.2";
import * as ReactDOMServer from "https://jspm.dev/react-dom@17.0.2/server";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [k: string]: any;
    }
  }
}

const app = new NHttp();

app.use((rev, next) => {
  rev.jsx = (element: any, opts = {} as any) => {
    rev.response.type("text/html").send(
      `<html>
                <head>
                    <title>${opts?.title || "No Title"}</title>
                </head>
                <body>
                    <div>${ReactDOMServer.renderToStaticMarkup(element)}</div>
                </body>
            </html>`,
    );
  };
  next();
});

app.get("/hello", ({ jsx }) => {
  jsx(
    <>
      <h1>Hello from react</h1>
      <h2>Hello from react</h2>
    </>,
    {
      title: "Hello title from react",
    },
  );
});

app.listen(3000);
