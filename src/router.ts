import { RequestEvent } from "./request_event.ts";
import { Handler, Handlers, TObject } from "./types.ts";

function findBase(pathname: string) {
  const iof = pathname.indexOf("/", 1);
  if (iof !== -1) return pathname.substring(0, iof);
  return pathname;
}

export default class Router<
  Rev extends RequestEvent = RequestEvent,
> {
  route: TObject = {};
  c_routes: TObject[] = [];
  midds: Handler<Rev>[] = [];
  pmidds: TObject = {};
  /**
   * method GET (app or router)
   * @example
   * app.get("/", ...handlers);
   */
  get: (path: string, ...handlers: Handlers<Rev>) => this;
  /**
   * method POST (app or router)
   * @example
   * app.post("/", ...handlers);
   */
  post: (path: string, ...handlers: Handlers<Rev>) => this;
  /**
   * method PUT (app or router)
   * @example
   * app.put("/", ...handlers);
   */
  put: (path: string, ...handlers: Handlers<Rev>) => this;
  /**
   * method PATCH (app or router)
   * @example
   * app.patch("/", ...handlers);
   */
  patch: (path: string, ...handlers: Handlers<Rev>) => this;
  /**
   * method DELETE (app or router)
   * @example
   * app.delete("/", ...handlers);
   */
  delete: (path: string, ...handlers: Handlers<Rev>) => this;
  /**
   * method ANY (allow all method directly) (app or router)
   * @example
   * app.any("/", ...handlers);
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
    url?: string,
    midAsset?: TObject,
  ) => {
    if (midAsset !== void 0) {
      const pfx = findBase(url || "/");
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
   * app.on("GET", "/", ...handlers);
   */
  on(method: string, path: string, ...handlers: Handlers<Rev>) {
    this.c_routes.push({ method, path, handlers });
    return this;
  }
  findRoute(method: string, url: string, notFound: Handler<Rev>) {
    let handlers: Handler[] = [];
    const params: TObject = {};
    if (this.route[method + url]) {
      const obj = this.route[method + url];
      if (obj.m) {
        handlers = obj.handlers as Handler[];
      } else {
        handlers = this.#addMidd(
          this.midds,
          notFound,
          obj.handlers as Handler[],
        ) as Handler[];
        this.route[method + url] = {
          m: true,
          handlers,
        };
      }
      return { params, handlers };
    }
    if (url !== "/" && url[url.length - 1] === "/") {
      const _url = url.slice(0, -1);
      if (this.route[method + _url]) {
        const obj = this.route[method + _url];
        if (obj.m) {
          handlers = obj.handlers as Handler[];
        } else {
          handlers = this.#addMidd(
            this.midds,
            notFound,
            obj.handlers as Handler[],
          ) as Handler[];
          this.route[method + _url] = {
            m: true,
            handlers,
          };
        }
        return { params, handlers };
      }
    }
    let i = 0;
    let j = 0;
    let obj: TObject = {};
    let routes = this.route[method] || [];
    let matches = [] as string[];
    let _404 = true;
    if (this.route["ANY"]) {
      routes = routes.concat(this.route["ANY"]);
    }
    const len = routes.length;
    while (i < len) {
      obj = routes[i];
      if (obj.pathx && obj.pathx.test(url)) {
        _404 = false;
        if (obj.params) {
          matches = obj.pathx.exec(url) as string[];
          matches.shift();
          while (j < obj.params.length) {
            const str = matches[j];
            params[obj.params[j] as unknown as string] = str
              ? decodeURIComponent(str)
              : null;
            j++;
          }
          if (params["wild"]) {
            params["wild"] = (params["wild"] as string).split("/");
          }
        }
        break;
      }
      i++;
    }
    handlers = this.#addMidd(
      this.midds,
      notFound,
      _404 ? [] as Handler[] : (obj.handlers || []) as Handler[],
      url,
      this.pmidds,
    ) as Handler[];
    return { params, handlers };
  }
}
