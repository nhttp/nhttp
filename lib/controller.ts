// controller.ts
/**
 * @module
 *
 * This module contains decorators-ontroller for NHttp.
 *
 * @example
 * ```tsx
 * import nhttp from "@nhttp/nhttp";
 * import { Controller, Post, Get, Status } from "@nhttp/nhttp/controller";
 *
 * ⁤@Controller("/user")
 * class UserController {
 *
 *    ⁤@Get()
 *    findAll() {...}
 *
 *    ⁤@Status(201)
 *    ⁤@Post()
 *    save() {...}
 * }
 *
 * const app = nhttp();
 *
 * app.use([new UserController()]);
 *
 * app.listen(8000);
 * ```
 */
import {
  findFns,
  type Handler,
  type Handlers,
  multipart,
  type NextFunction,
  type RequestEvent,
  type TMultipartUpload,
  type TObject,
  type TRet,
} from "./deps.ts";
import { Metadata } from "./metadata.ts";
// deno-lint-ignore ban-types
type EObject = {};
/**
 * `type` TDecorator.
 */
export type TDecorator = TRet;
function concatRegexp(prefix: string | RegExp, path: RegExp) {
  if (prefix === "") return path;
  prefix = new RegExp(prefix);
  let flags = prefix.flags + path.flags;
  flags = Array.from(new Set(flags.split(""))).join();
  return new RegExp(prefix.source + path.source, flags);
}
type TStatus<
  Rev extends RequestEvent = RequestEvent,
> = (
  rev: Rev,
  next: NextFunction,
) => number | Promise<number>;

type THeaders<
  Rev extends RequestEvent = RequestEvent,
> = (
  rev: Rev,
  next: NextFunction,
) => TObject | Promise<TObject>;

type TString<
  Rev extends RequestEvent = RequestEvent,
> = (
  rev: Rev,
  next: NextFunction,
) => string | Promise<string>;

type TMethod = (
  path?: string | RegExp,
) => TDecorator;

/**
 * helper add route decorator.
 */
export function addRoute(
  className: string,
  prop: string,
  handler: Handler,
  opts: { path?: string | RegExp; method: string },
) {
  Metadata.init();
  const metadata = Metadata.get();
  metadata[className] = metadata[className] || {};
  const obj = metadata[className]["route"] || {};
  obj[prop] = obj[prop] || {};
  const fns = (obj[prop].fns || []).concat([handler]);
  obj[prop] = { path: opts.path, method: opts.method, fns };
  metadata[className]["route"] = obj;
}

/**
 * helper join handlers decorator.
 */
export function joinHandlers(
  className: TRet,
  prop: string,
  arr: TRet[],
) {
  Metadata.init();
  const metadata = Metadata.get();
  metadata[className] = metadata[className] || {};
  const obj = metadata[className]["route"] || {};
  obj[prop] = obj[prop] || {};
  obj[prop].fns = arr.concat(obj[prop].fns || []);
  metadata[className]["route"] = obj;
}

/**
 * helper add http-method decorator.
 */
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

/**
 * View decorator.
 */
export function View(name: string | TString): TDecorator {
  return (target: TObject, prop: string, des: PropertyDescriptor) => {
    const className = target.constructor.name;
    const viewFn: Handler = async (rev, next) => {
      const index = typeof name === "function" ? await name(rev, next) : name;
      const fns = Metadata.get()[className]["route"][prop]["fns"];
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
/**
 * Jsx decorator.
 */
export function Jsx(): TDecorator {
  return (target: TObject, prop: string, des: PropertyDescriptor) => {
    const className = target.constructor.name;
    const jsxFn: Handler = async (rev, next) => {
      const fns = Metadata.get()[className]["route"][prop]["fns"];
      const body = await fns[fns.length - 1](rev, next);
      return await rev.response.render(body);
    };
    joinHandlers(className, prop, [jsxFn]);
    return des;
  };
}

/**
 * Upload decorator.
 */
export function Upload(options: TMultipartUpload): TDecorator {
  return (target: TObject, prop: string, des: PropertyDescriptor) => {
    const className = target.constructor.name;
    joinHandlers(className, prop, [multipart.upload(options)]);
    return des;
  };
}
/**
 * Wares decorator. for add middlewares in decorator.
 */
export function Wares<
  Rev extends RequestEvent = RequestEvent,
  T = EObject,
>(
  ...middlewares: Handlers<T, Rev> | { new (...args: TRet[]): TRet }[]
): TDecorator {
  return (target: TObject, prop: string, des: PropertyDecorator) => {
    const className = target.constructor.name;
    joinHandlers(className, prop, middlewares);
    return des;
  };
}
/**
 * Create custom decorator from middleware.
 */
export function createDecorator<
  Rev extends RequestEvent = RequestEvent,
  T = EObject,
>(...middlewares: Handlers<T, Rev>): TDecorator {
  return Wares<Rev, T>(...middlewares);
}
/**
 * Status decorator. for add http-status-code in decorator.
 */
export function Status(status: number | TStatus): TDecorator {
  return (target: TObject, prop: string, des: PropertyDescriptor) => {
    const statusFn: Handler = async (rev, next) => {
      rev.response.status(
        typeof status === "function" ? await status(rev, next) : status,
      );
      return next();
    };
    const className = target.constructor.name;
    joinHandlers(className, prop, [statusFn]);
    return des;
  };
}
/**
 * Type decorator. for add content-type in decorator.
 */
export function Type(name: string | TString, charset?: string): TDecorator {
  return (target: TObject, prop: string, des: PropertyDescriptor) => {
    const typeFn: Handler = async (rev, next) => {
      const value = typeof name === "function" ? await name(rev, next) : name;
      rev.response.type(value, charset);
      return next();
    };
    const className = target.constructor.name;
    joinHandlers(className, prop, [typeFn]);
    return des;
  };
}
/**
 * Type decorator. for set response-headers in decorator.
 */
export function Header(header: TObject | THeaders): TDecorator {
  return (target: TObject, prop: string, des: PropertyDescriptor) => {
    const headerFn: Handler = async (rev, next) => {
      rev.response.header(
        typeof header === "function" ? await header(rev, next) : header,
      );
      return next();
    };
    const className = target.constructor.name;
    joinHandlers(className, prop, [headerFn]);
    return des;
  };
}
/**
 * Inject decorator. injector service decorator.
 */
export function Inject(value?: TRet, ...args: TRet): TDecorator {
  return function (target: TObject, prop: string) {
    target[prop] = typeof value === "function" ? new value(...args) : value;
    if (value === void 0 && target.__val === void 0) {
      target.__val = true;
    }
  };
}
/**
 * Get decorator. http-method Get in decorator.
 */
export const Get: TMethod = (path) => addMethod("GET", path);
/**
 * Post decorator. http-method Post in decorator.
 */
export const Post: TMethod = (path) => addMethod("POST", path);
/**
 * Put decorator. http-method Put in decorator.
 */
export const Put: TMethod = (path) => addMethod("PUT", path);
/**
 * Delete decorator. http-method Delete in decorator.
 */
export const Delete: TMethod = (path) => addMethod("DELETE", path);
/**
 * Any decorator. http-method Any in decorator.
 */
export const Any: TMethod = (path) => addMethod("ANY", path);
/**
 * Options decorator. http-method Options in decorator.
 */
export const Options: TMethod = (path) => addMethod("OPTIONS", path);
/**
 * Head decorator. http-method Head in decorator.
 */
export const Head: TMethod = (path) => addMethod("HEAD", path);
/**
 * Trace decorator. http-method Trace in decorator.
 */
export const Trace: TMethod = (path) => addMethod("TRACE", path);
/**
 * Connect decorator. http-method Connect in decorator.
 */
export const Connect: TMethod = (path) => addMethod("CONNECT", path);
/**
 * Patch decorator. http-method Patch in decorator.
 */
export const Patch: TMethod = (path) => addMethod("PATCH", path);

/**
 * Controller decorator.
 */
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
    const obj = Metadata.get()?.[className]?.["route"];
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
