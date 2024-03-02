import {
  findFns,
  Handler,
  Handlers,
  multipart,
  NextFunction,
  RequestEvent,
  TMultipartUpload,
  TObject,
  TRet,
} from "./deps.ts";
export type TDecorator = TRet;
function concatRegexp(prefix: string | RegExp, path: RegExp) {
  if (prefix === "") return path;
  prefix = new RegExp(prefix);
  let flags = prefix.flags + path.flags;
  flags = Array.from(new Set(flags.split(""))).join();
  return new RegExp(prefix.source + path.source, flags);
}

declare global {
  // deno-lint-ignore no-var
  var NHttpMetadata: TRet;
}

type TStatus<
  Rev extends RequestEvent = RequestEvent,
> = (
  rev: Rev,
  next: NextFunction,
) => number;

type THeaders<
  Rev extends RequestEvent = RequestEvent,
> = (
  rev: Rev,
  next: NextFunction,
) => TObject;

type TString<
  Rev extends RequestEvent = RequestEvent,
> = (
  rev: Rev,
  next: NextFunction,
) => string;

type TMethod = (
  path?: string | RegExp,
) => TDecorator;

export function addRoute(
  className: string,
  prop: string,
  handler: Handler,
  opts: { path?: string | RegExp; method: string },
) {
  globalThis.NHttpMetadata = globalThis.NHttpMetadata || {};
  const metadata = globalThis.NHttpMetadata;
  metadata[className] = metadata[className] || {};
  const obj = metadata[className]["route"] || {};
  obj[prop] = obj[prop] || {};
  const fns = (obj[prop].fns || []).concat([handler]);
  obj[prop] = { path: opts.path, method: opts.method, fns };
  metadata[className]["route"] = obj;
}

export function joinHandlers(
  className: TRet,
  prop: string,
  arr: TRet[],
) {
  globalThis.NHttpMetadata = globalThis.NHttpMetadata || {};
  const metadata = globalThis.NHttpMetadata;
  metadata[className] = metadata[className] || {};
  const obj = metadata[className]["route"] || {};
  obj[prop] = obj[prop] || {};
  obj[prop].fns = arr.concat(obj[prop].fns || []);
  metadata[className]["route"] = obj;
}

export function addMethod(method: string, path?: string | RegExp): TDecorator {
  path ??= "/";
  return (target: TObject, prop: string, des: PropertyDescriptor) => {
    const ori = des.value;
    des.value = function (rev: RequestEvent, next: NextFunction) {
      const result = ori.apply(target, [rev, next]);
      return result;
    };
    const className = target.constructor.name;
    addRoute(className, prop, des.value, { path, method });
    return des;
  };
}

export function View(name: string | TString): TDecorator {
  return (target: TObject, prop: string, des: PropertyDescriptor) => {
    const className = target.constructor.name;
    const viewFn: Handler = async (rev, next) => {
      const index = typeof name === "function" ? name(rev, next) : name;
      const fns = globalThis.NHttpMetadata[className]["route"][prop]["fns"];
      const body = await fns[fns.length - 1](rev, next);
      return await rev.response.render(
        index,
        typeof body === "object" ? body : {},
      );
    };
    joinHandlers(className, prop, [viewFn]);
    return des;
  };
}

export function Jsx(): TDecorator {
  return (target: TObject, prop: string, des: PropertyDescriptor) => {
    const className = target.constructor.name;
    const jsxFn: Handler = (rev, next) => {
      const fns = globalThis.NHttpMetadata[className]["route"][prop]["fns"];
      const body = fns[fns.length - 1](rev, next);
      return rev.response.render(body);
    };
    joinHandlers(className, prop, [jsxFn]);
    return des;
  };
}

export function Upload(options: TMultipartUpload): TDecorator {
  return (target: TObject, prop: string, des: PropertyDescriptor) => {
    const className = target.constructor.name;
    joinHandlers(className, prop, [multipart.upload(options)]);
    return des;
  };
}

export function Wares<
  Rev extends RequestEvent = RequestEvent,
>(
  ...middlewares: Handlers<Rev> | { new (...args: TRet[]): TRet }[]
): TDecorator {
  return (target: TObject, prop: string, des: PropertyDecorator) => {
    const className = target.constructor.name;
    joinHandlers(className, prop, middlewares);
    return des;
  };
}

export function Status(status: number | TStatus): TDecorator {
  return (target: TObject, prop: string, des: PropertyDescriptor) => {
    const statusFn: Handler = (rev, next) => {
      rev.response.status(
        typeof status === "function" ? status(rev, next) : status,
      );
      return next();
    };
    const className = target.constructor.name;
    joinHandlers(className, prop, [statusFn]);
    return des;
  };
}

export function Type(name: string | TString, charset?: string): TDecorator {
  return (target: TObject, prop: string, des: PropertyDescriptor) => {
    const typeFn: Handler = (rev, next) => {
      const value = typeof name === "function" ? name(rev, next) : name;
      rev.response.type(value, charset);
      return next();
    };
    const className = target.constructor.name;
    joinHandlers(className, prop, [typeFn]);
    return des;
  };
}

export function Header(header: TObject | THeaders): TDecorator {
  return (target: TObject, prop: string, des: PropertyDescriptor) => {
    const headerFn: Handler = (rev, next) => {
      rev.response.header(
        typeof header === "function" ? header(rev, next) : header,
      );
      return next();
    };
    const className = target.constructor.name;
    joinHandlers(className, prop, [headerFn]);
    return des;
  };
}

export function Inject(value?: TRet, ...args: TRet): TDecorator {
  return function (target: TObject, prop: string) {
    target[prop] = typeof value === "function" ? new value(...args) : value;
    if (value === void 0 && target.__val === void 0) {
      target.__val = true;
    }
  };
}

export const Get: TMethod = (path) => addMethod("GET", path);
export const Post: TMethod = (path) => addMethod("POST", path);
export const Put: TMethod = (path) => addMethod("PUT", path);
export const Delete: TMethod = (path) => addMethod("DELETE", path);
export const Any: TMethod = (path) => addMethod("ANY", path);
export const Options: TMethod = (path) => addMethod("OPTIONS", path);
export const Head: TMethod = (path) => addMethod("HEAD", path);
export const Trace: TMethod = (path) => addMethod("TRACE", path);
export const Connect: TMethod = (path) => addMethod("CONNECT", path);
export const Patch: TMethod = (path) => addMethod("PATCH", path);

export function Controller(
  path?: string,
  ...middlewares: Handlers | { new (...args: TRet[]): TRet }[]
): TDecorator {
  path ??= "";
  if (path !== "/" && path[path.length - 1] === "/") {
    path = path.slice(0, -1);
  }
  return (target: TRet) => {
    const cRoutes = [] as TObject[];
    const className = target.name;
    const obj = globalThis.NHttpMetadata?.[className]?.["route"];
    if (!obj) {
      throw new TypeError("Typo: Controller with no routing");
    }
    const midds = findFns(middlewares);
    for (const k in obj) {
      if (obj[k].path instanceof RegExp) {
        obj[k].path = concatRegexp(path || "", obj[k].path);
      } else {
        if (path) obj[k].path = path + obj[k].path;
        if (obj[k].path.startsWith("//")) {
          obj[k].path = obj[k].path.substring(1);
        }
        if (obj[k].path !== "/" && obj[k].path.endsWith("/")) {
          obj[k].path = obj[k].path.slice(0, -1);
        }
      }
      cRoutes.push(obj[k]);
    }
    if (midds.length) {
      for (let i = 0; i < cRoutes.length; i++) {
        cRoutes[i].fns = midds.concat(cRoutes[i].fns);
      }
    }
    const ori = target;
    const fn = Object.defineProperty(
      function (...args: TRet) {
        const t = new ori(...args);
        Object.assign(t, target.prototype);
        Object.assign(ori.prototype, t);
        t.c_routes = cRoutes;
        return t;
      },
      "name",
      { value: className },
    );
    return fn;
  };
}
