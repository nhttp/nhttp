import { THandler, THandlers } from "./types.ts";

function findBase(pathname: string) {
  let iof = pathname.indexOf("/", 1);
  if (iof !== -1) return pathname.substring(0, iof);
  return pathname;
}

export default class Router {
  route: Record<string, any> = {};
  c_routes: Record<string, any>[] = [];
  midds: THandler[] = [];
  pmidds: Record<string, any> = {};
  get: (path: string, ...handlers: THandlers) => this;
  post: (path: string, ...handlers: THandlers) => this;
  put: (path: string, ...handlers: THandlers) => this;
  patch: (path: string, ...handlers: THandlers) => this;
  delete: (path: string, ...handlers: THandlers) => this;
  any: (path: string, ...handlers: THandlers) => this;
  head: (path: string, ...handlers: THandlers) => this;
  options: (path: string, ...handlers: THandlers) => this;
  trace: (path: string, ...handlers: THandlers) => this;
  connect: (path: string, ...handlers: THandlers) => this;
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
    midds: THandler[],
    notFound: THandler,
    fns: THandler[],
    url: string = "/",
    midAsset?: { [k: string]: any },
  ) => {
    if (midAsset !== void 0) {
      let pfx = findBase(url);
      if (midAsset[pfx]) fns = midAsset[pfx].concat(fns);
    }
    if (midds.length) fns = midds.concat(fns);
    return (fns = fns.concat([notFound]));
  };
  on(method: string, path: string, ...handlers: THandlers) {
    this.c_routes.push({ method, path, handlers });
    return this;
  }
  findRoute(method: string, url: string, notFound: THandler) {
    let params: { [key: string]: any } = {},
      handlers: any[] = [];
    if (this.route[method + url]) {
      let obj = this.route[method + url];
      if (obj.m) handlers = obj.handlers;
      else {
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
      } else key = url.substring(0, url.lastIndexOf("/"));
      if (this.route[method + key + "/:p"]) {
        let obj = this.route[method + key + "/:p"];
        params[obj.params] = url.substring(url.lastIndexOf("/") + 1);
        if (obj.m) handlers = obj.handlers;
        else {
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
          obj: any = {},
          routes = this.route[method] || [],
          matches = [],
          nf = true;
        if (this.route["ANY"]) routes = routes.concat(this.route["ANY"]);
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
                if (params["wild"]) params["wild"] = params["wild"].split("/");
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
