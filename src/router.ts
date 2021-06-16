import { Handler, Handlers, RequestEvent } from "./types.ts";

function findBase(pathname: string) {
  let iof = pathname.indexOf("/", 1);
  if (iof !== -1) return pathname.substring(0, iof);
  return pathname;
}

export default class Router<
  Rev extends RequestEvent = RequestEvent,
> {
  route: Record<string, any> = {};
  c_routes: Record<string, any>[] = [];
  midds: Handler<Rev>[] = [];
  pmidds: Record<string, any> = {};
  /**
   * method GET (app or router)
   * @example
   * app.get("/", ...handlers);
   *
   * app.get("/", ({ response }) => {
   *    response.send("Hello");
   * })
   * app.get("/", midd1, midd2, ({ response }) => {
   *    response.send("Hello");
   * })
   * app.get("/", [midd1, midd2], ({ response }) => {
   *    response.send("Hello");
   * })
   */
  get: (path: string, ...handlers: Handlers<Rev>) => this;
  /**
   * method POST (app or router)
   * @example
   * app.post("/", ...handlers);
   *
   * app.post("/", ({ response }) => {
   *    response.status(201).send("Created");
   * })
   * app.post("/", midd1, midd2, ({ response }) => {
   *    response.status(201).send("Created");
   * })
   * app.post("/", [midd1, midd2], ({ response }) => {
   *    response.status(201).send("Created");
   * })
   */
  post: (path: string, ...handlers: Handlers<Rev>) => this;
  /**
   * method PUT (app or router)
   * @example
   * app.put("/", ...handlers);
   *
   * app.put("/", ({ response }) => {
   *    response.send("Hello");
   * })
   * app.put("/", midd1, midd2, ({ response }) => {
   *    response.send("Hello");
   * })
   * app.put("/", [midd1, midd2], ({ response }) => {
   *    response.send("Hello");
   * })
   */
  put: (path: string, ...handlers: Handlers<Rev>) => this;
  /**
   * method PATCH (app or router)
   * @example
   * app.patch("/", ...handlers);
   *
   * app.patch("/", ({ response }) => {
   *    response.send("Hello");
   * })
   * app.patch("/", midd1, midd2, ({ response }) => {
   *    response.send("Hello");
   * })
   * app.patch("/", [midd1, midd2], ({ response }) => {
   *    response.send("Hello");
   * })
   */
  patch: (path: string, ...handlers: Handlers<Rev>) => this;
  /**
   * method DELETE (app or router)
   * @example
   * app.delete("/", ...handlers);
   *
   * app.delete("/", ({ response }) => {
   *    response.send("Hello");
   * })
   * app.delete("/", midd1, midd2, ({ response }) => {
   *    response.send("Hello");
   * })
   * app.delete("/", [midd1, midd2], ({ response }) => {
   *    response.send("Hello");
   * })
   */
  delete: (path: string, ...handlers: Handlers<Rev>) => this;
  /**
   * method ANY (allow all method directly) (app or router)
   * @example
   * app.any("/", ...handlers);
   *
   * app.any("/", ({ response }) => {
   *    response.send("Hello");
   * })
   * app.any("/", midd1, midd2, ({ response }) => {
   *    response.send("Hello");
   * })
   * app.any("/", [midd1, midd2], ({ response }) => {
   *    response.send("Hello");
   * })
   */
  any: (path: string, ...handlers: Handlers<Rev>) => this;
  head: (path: string, ...handlers: Handlers<Rev>) => this;
  options: (path: string, ...handlers: Handlers<Rev>) => this;
  trace: (path: string, ...handlers: Handlers<Rev>) => this;
  connect: (path: string, ...handlers: Handlers<Rev>) => this;
  constructor() {
    this.get = this.on.bind(this, "GET");
    this.post = this.on.bind(this, "POST");
    this.put = this.on.bind(this, "PUT");
    this.patch = this.on.bind(this, "PATCH");
    this.delete = this.on.bind(this, "DELETE");
    this.any = this.on.bind(this, "ANY");
    this.head = this.on.bind(this, "HEAD");
    this.options = this.on.bind(this, "OPTIONS");
    this.trace = this.on.bind(this, "TRACE");
    this.connect = this.on.bind(this, "CONNECT");
  }
  #addMidd = (
    midds: Handler<Rev>[],
    notFound: Handler<Rev>,
    fns: Handler<Rev>[],
    url: string = "/",
    midAsset?: { [k: string]: any },
  ) => {
    if (midAsset !== void 0) {
      let pfx = findBase(url);
      if (midAsset[pfx]) {
        fns = midAsset[pfx].concat(fns);
      }
    }
    if (midds.length) {
      fns = midds.concat(fns);
    }
    return (fns = fns.concat([notFound]));
  };
  /**
   * build handlers (app or router)
   * @example
   * app.on("GET", "/", ...handlers)
   *
   * app.on("GET", "/", ({ response }) => {
   *    response.send("Hello");
   * })
   */
  on(method: string, path: string, ...handlers: Handlers<Rev>) {
    this.c_routes.push({ method, path, handlers });
    return this;
  }
  findRoute(method: string, url: string, notFound: Handler<Rev>) {
    let params: { [key: string]: any } = {};
    let handlers: Handler<Rev>[] = [];
    if (this.route[method + url]) {
      let obj = this.route[method + url];
      if (obj.m) {
        handlers = obj.handlers;
      } else {
        handlers = this.#addMidd(this.midds, notFound, obj.handlers);
        this.route[method + url] = {
          m: true,
          handlers,
        };
      }
    } else {
      let key = "";
      if (url.lastIndexOf("/") === (url.length - 1)) {
        let _key = url.slice(0, -1);
        key = _key.substring(0, _key.lastIndexOf("/"));
      } else {
        key = url.substring(0, url.lastIndexOf("/"));
      }
      if (this.route[method + key + "/:p"]) {
        let obj = this.route[method + key + "/:p"];
        params[obj.params] = url.substring(url.lastIndexOf("/") + 1);
        if (obj.m) {
          handlers = obj.handlers;
        } else {
          handlers = this.#addMidd(this.midds, notFound, obj.handlers);
          this.route[method + key + "/:p"] = {
            m: true,
            params: obj.params,
            handlers,
          };
        }
      } else {
        let i = 0,
          j = 0,
          obj = {} as any,
          routes = this.route[method] || [],
          matches = [],
          nf = true;
        if (this.route["ANY"]) {
          routes = routes.concat(this.route["ANY"]);
        }
        let len = routes.length;
        if (len) {
          while (i < len) {
            obj = routes[i];
            if (obj.pathx && obj.pathx.test(url)) {
              nf = false;
              handlers = this.#addMidd(
                this.midds,
                notFound,
                obj.handlers,
                url,
                this.pmidds,
              );
              if (obj.params) {
                matches = obj.pathx.exec(url);
                while (j < obj.params.length) {
                  params[obj.params[j]] = matches[++j] || null;
                }
                if (params["wild"]) {
                  params["wild"] = params["wild"].split("/");
                }
              }
              break;
            }
            i++;
          }
        }
        if (nf) {
          handlers = this.#addMidd(this.midds, notFound, [], url, this.pmidds);
        }
      }
    }
    return { params, handlers };
  }
}
