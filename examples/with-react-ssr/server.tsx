import { NHttp, ReactDOMServer } from "./deps-server.ts";
import { React, ReactRouterDom } from "./deps-client.ts";
import { routes } from "./routes.tsx";
import { App } from "./app.tsx";

const { StaticRouter, matchPath } = ReactRouterDom;

const { files } = await Deno.emit(
  "./client.tsx",
  {
    check: false,
    bundle: "module",
    compilerOptions: {
      lib: ["dom", "dom.iterable", "esnext"],
    },
  },
);

const BROWSER_PATH = "/dev-client.js";

class Server extends NHttp {
  constructor() {
    super();
    // build middleware and mutate body for react
    this.use((rev, next) => {
      // deno-lint-ignore no-explicit-any
      rev.jsx = (element: any, opts = {} as any) => {
        // deno-lint-ignore no-explicit-any
        const content = (ReactDOMServer as any).renderToString(element);
        // deno-fmt-ignore
        return rev.response.type("text/html").send(
                `<!doctype html>
                    <html>
                        <head>
                            <title>${opts.title}</title>
                            <meta name="description" content="${opts.description}">
                            <script>window.__INITIAL_DATA__ = ${JSON.stringify(opts)};</script>
                        </head>
                        <body>
                            <div id="root">${content}</div>
                            <script src="${BROWSER_PATH}" defer></script>
                        </body>
                    </html>`,
        );
      };
      return next();
    });
    // get the client js
    this.get(BROWSER_PATH, ({ response }) => {
      return response.type("application/javascript").send(
        files["deno:///bundle.js"],
      );
    });
    // exact for all route
    this.get("/*", ({ url, response, jsx }) => {
      const route = routes.find((r) => matchPath(url, r));
      if (route) {
        const seo = route.seo;
        const content = (
          <StaticRouter location={url}>
            <App
              isServer={true}
              Component={route.component}
              initData={{ seo: route.seo }}
            />
          </StaticRouter>
        );
        return jsx(content, seo);
      }
      return response.status(404).send("Not Found");
    });
  }
}
await new Server().listen(
  3000,
  () => console.log("> Running on http://localhost:3000/"),
);
