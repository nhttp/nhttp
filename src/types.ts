// types.ts
import type { RequestEvent } from "./request_event.ts";
import type Router from "./router.ts";
/**
 * `type` TRet. aliases from `any`.
 */
// deno-lint-ignore no-explicit-any
export type TRet = any;
/**
 * `type` EObject.
 */
// deno-lint-ignore ban-types
export type EObject = {};
/**
 * `type` TObject.
 */
export type TObject = { [k: string]: TRet };
/**
 * `type` Merge.
 */
export type Merge<A, B> = {
  [K in keyof (A & B)]: (
    K extends keyof B ? B[K]
      : (K extends keyof A ? A[K] : never)
  );
};
/**
 * `type` TSendBody.
 */
export type TSendBody =
  | string
  | Response
  | ReadableStream
  | Blob
  | TObject
  | null
  | number;
/**
 * `type` NextFunction.
 */
export type NextFunction = (
  err?: TRet,
) => Promise<Response>;
/**
 * `type` RetHandler.
 */
export type RetHandler =
  | Promise<void | string | TObject | number>
  | void
  | string
  | TObject
  | number;
/**
 * `type` Handler.
 */
export type Handler<
  T = EObject,
  Rev extends RequestEvent = RequestEvent,
> = (
  rev: Merge<Rev, T>,
  next: NextFunction,
  ...args: TRet
) => RetHandler;
/**
 * `type` Handlers.
 */
export type Handlers<
  T = EObject,
  Rev extends RequestEvent = RequestEvent,
> = Array<Handler<T, Rev> | Handler<T, Rev>[]>;
/**
 * `type` TValidBody.
 */
export type TValidBody = number | string | false | undefined;
/**
 * `type` TBodyParser.
 */
export type TBodyParser = {
  /**
   * type json.
   */
  json?: TValidBody;
  /**
   * type urlencoded.
   */
  urlencoded?: TValidBody;
  /**
   * type raw.
   */
  raw?: TValidBody;
  /**
   * type multipart.
   */
  multipart?: TValidBody;
};
/**
 * `type` TSizeList.
 */
export type TSizeList = {
  /**
   * Byte.
   */
  b: number;
  /**
   * Kilo Byte.
   */
  kb: number;
  /**
   * Mega Byte.
   */
  mb: number;
  /**
   * Giga Byte.
   */
  gb: number;
  /**
   * Tera Byte.
   */
  tb: number;
  /**
   * Peta Byte.
   */
  pb: number;
  /**
   * more.
   */
  [key: string]: unknown;
};
/**
 * `type` Cookie.
 */
export type Cookie = {
  /**
   * cookies expire.
   */
  expires?: Date;
  /**
   * cookies max-age.
   */
  maxAge?: number;
  /**
   * cookies domain.
   */
  domain?: string;
  /**
   * cookies path.
   */
  path?: string;
  /**
   * config security.
   */
  secure?: boolean;
  /**
   * config security http/https.
   */
  httpOnly?: boolean;
  /**
   * config sites.
   */
  sameSite?: "Strict" | "Lax" | "None";
  /**
   * other.
   */
  other?: string[];
  /**
   * config encode cookies.
   */
  encode?: boolean;
};
/**
 * `type` TQueryFunc.
 */
export type TQueryFunc = TRet;
/**
 * `type` TApp.
 */
export type TApp = {
  /**
   * custom parseQuery
   * @example
   * // example using qs lib.
   * const app = nhttp({
   *   parseQuery: qs.parse
   * })
   */
  parseQuery?: TQueryFunc;
  /**
   * bodyParser.
   * @example
   * const app = nhttp({ bodyParser: true });
   *
   * // or
   * const app = nhttp({
   *   bodyParser: {
   *      // disable json body
   *      json: false,
   *      // custom limit for urlencoded
   *      urlencoded: "1mb"
   *   }
   * })
   */
  bodyParser?: TBodyParser | boolean;
  /**
   * env default to dev.
   * @example
   * const app = nhttp({
   *   env: "production"
   * })
   */
  env?: string;
  /**
   * Flash server for `Deno`. default to false.
   * @deprecated
   */
  flash?: boolean;
  /**
   * stackError. send error stacks in response for default error handling. default to true.
   * @example
   * const app = nhttp({
   *    // disable stackError
   *    stackError: false
   * })
   */
  stackError?: boolean;
};
/**
 * `type` FetchEvent.
 */
export type FetchEvent = TRet;
/**
 * `type` RouterOrWare.
 */
export type RouterOrWare<
  T extends unknown = unknown,
  Rev extends RequestEvent = RequestEvent,
> =
  | Handler<T, Rev>
  | Handler<T, Rev>[]
  | Router<Rev>
  | Router<Rev>[]
  | TObject
  | TObject[];
/**
 * `type` FetchHandler.
 */
export type FetchHandler = (
  request: Request,
  ...args: TRet
) => Response | Promise<Response>;
/**
 * `type` ListenOptions.
 */
export type ListenOptions = {
  /**
   * port number server. default to `8000`.
   */
  port?: number;
  /**
   * fetch handler.
   */
  fetch?: FetchHandler;
  /**
   * hostname server.
   */
  hostname?: string;
  /**
   * https key.
   */
  key?: string;
  /**
   * https cert.
   */
  cert?: string;
  /**
   * https keyFile.
   */
  keyFile?: string;
  /**
   * https certFile.
   */
  certFile?: string;
  /**
   * transport. default to `tcp`.
   */
  transport?: "tcp";
  /**
   * alpnProtocols for http2.
   */
  alpnProtocols?: string[];
  /**
   * handler `FetchHandler`.
   */
  handler?: FetchHandler;
  /**
   * show secondary paramaters.
   */
  showInfo?: boolean;
  /**
   * support `AbortSignal`.
   */
  signal?: AbortSignal;
  /**
   * support `immediate` (nodejs only). default to `true`.
   */
  immediate?: boolean;
  /**
   * any.
   */
  [k: string]: TRet;
};
/**
 * `interface` NFile.
 */
export interface NFile extends File {
  /**
   * filename.
   */
  filename: string;
  /**
   * path.
   */
  path: string;
  /**
   * pathfile.
   */
  pathfile: string;
  /**
   * any.
   */
  [k: string]: TRet;
}
/**
 * `type` EngineOptions.
 */
export type EngineOptions = {
  /**
   * Extension
   */
  ext?: string;
  /**
   * Base folder views engine
   */
  base?: string;
};
/**
 * `type` MatchRoute.
 */
export type MatchRoute = {
  /**
   * lookup method.
   */
  method: string;
  /**
   * lookup parameters.
   */
  params: TObject;
  /**
   * lookup path.
   */
  path: string | RegExp;
  /**
   * lookup pathname.
   */
  pathname: string;
  /**
   * lookup query-params.
   */
  query: TObject;
  /**
   * lookup route-pattern.
   */
  readonly pattern: RegExp;
  /**
   * lookup is wildcard or not.
   */
  wild: boolean;
};
/**
 * `type` CreateRequest.
 */
export type CreateRequest = {
  /**
   * return to text.
   */
  text: () => Promise<string>;
  /**
   * return to json.
   */
  json: () => Promise<TRet>;
  /**
   * is ok or not.
   */
  ok: () => Promise<boolean>;
  /**
   * lookup statuscode.
   */
  status: () => Promise<number>;
  /**
   * lookup Response.
   */
  res: () => Response | Promise<Response>;
};
/**
 * `type` BuildListenOptions.
 */
export type BuildListenOptions = {
  /**
   * options listen.
   */
  opts: ListenOptions;
  /**
   * handler `FetchHandler`.
   */
  handler: FetchHandler;
};
/**
 * `type` ErrorResponseJson
 */
export type ErrorResponseJson = {
  /**
   * lookup Error status-code.
   */
  status: number;
  /**
   * lookup Error message.
   */
  message: string;
  /**
   * lookup Error name.
   */
  name: string;
  /**
   * lookup Error stack.
   */
  stack: string[] | undefined;
};
