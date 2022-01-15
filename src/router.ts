import { RequestEvent } from "./request_event.ts";
import { Handler, Handlers, TObject } from "./types.ts";
import { concatRegexp, decURI } from "./utils.ts";

function base(url: string) {
  const iof = url.indexOf("/", 1);
  if (iof !== -1) return url.substring(0, iof);
  return url;
}

type TRouter = { base?: string };
type MethodHandler<
  Rev extends RequestEvent = RequestEvent,
  T = TObject,
> = (path: string | RegExp, ...handlers: Handlers<Rev>) => T;
/**
 * Router
 * @example
 * const router = new Router();
 * const router = new Router({ base: '/items' });
 */
export default class Router<
  Rev extends RequestEvent = RequestEvent,
> {
  route: TObject = {};
  c_routes: TObject[] = [];
  midds: Handler<Rev>[] = [];
  pmidds: TObject | undefined;
  /**
   * method GET (app or router)
   * @example
   * app.get("/", ...handlers);
   */
  get: MethodHandler<Rev, this>;
  /**
   * method POST (app or router)
   * @example
   * app.post("/", ...handlers);
   */
  post: MethodHandler<Rev, this>;
  /**
   * method PUT (app or router)
   * @example
   * app.put("/", ...handlers);
   */
  put: MethodHandler<Rev, this>;
  /**
   * method PATCH (app or router)
   * @example
   * app.patch("/", ...handlers);
   */
  patch: MethodHandler<Rev, this>;
  /**
   * method DELETE (app or router)
   * @example
   * app.delete("/", ...handlers);
   */
  delete: MethodHandler<Rev, this>;
  /**
   * method ANY (allow all method directly) (app or router)
   * @example
   * app.any("/", ...handlers);
   */
  any: MethodHandler<Rev, this>;
  head: MethodHandler<Rev, this>;
  options: MethodHandler<Rev, this>;
  trace: MethodHandler<Rev, this>;
  connect: MethodHandler<Rev, this>;
  private base = "";
  constructor({ base = "" }: TRouter = {}) {
    this.base = base;
    if (this.base === "/") this.base = "";
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
  private single(mtd: string, url: string) {
    let { fns, m } = this.route[mtd + url];
    if (m) return { params: {}, fns };
    fns = this.midds.concat(fns);
    this.route[mtd + url] = { m: true, fns };
    return { params: {}, fns };
  }
  /**
   * build handlers (app or router)
   * @example
   * app.on("GET", "/", ...handlers);
   */
  on(method: string, path: string | RegExp, ...handlers: Handlers<Rev>) {
    let _path: string | RegExp;
    if (path instanceof RegExp) _path = concatRegexp(this.base, path);
    else {
      if (path === "/" && this.base !== "") path = "";
      _path = this.base + path;
    }
    this.c_routes.push({ method, path: _path, fns: handlers });
    return this;
  }
  find(method: string, url: string, fn404: Handler<Rev>) {
    if (this.route[method + url]) {
      return this.single(method, url);
    }
    if (url !== "/" && url[url.length - 1] === "/") {
      const _url = url.slice(0, -1);
      if (this.route[method + _url]) {
        return this.single(method, _url);
      }
    }
    let fns: Handler<Rev>[] = [], params: TObject = {};
    let i = 0, obj: TObject = {};
    let arr = this.route[method] || [];
    let match: TObject;
    if (this.route["ANY"]) arr = this.route["ANY"].concat(arr);
    const len = arr.length;
    while (i < len) {
      obj = arr[i];
      if (obj.pathx && obj.pathx.test(url)) {
        url = decURI(url);
        match = obj.pathx.exec(url);
        fns = obj.fns;
        if (match.groups) params = match.groups || {};
        if (obj.wild && typeof match[1] === "string") {
          params["wild"] = match[1].split("/");
          params["wild"].shift();
        }
        break;
      }
      i++;
    }
    if (this.pmidds) {
      const p = base(url || "/");
      if (this.pmidds[p]) fns = this.pmidds[p].concat(fns);
    }
    fns = this.midds.concat(fns, [fn404]);
    return { params, fns };
  }
}
