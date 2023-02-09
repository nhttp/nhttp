import { RequestEvent } from "./request_event.ts";
import Router from "./router.ts";

// deno-lint-ignore no-explicit-any
export type TRet = any;
export type TObject = { [k: string]: TRet };
export type TSendBody =
  | string
  | Response
  | ReadableStream
  | Blob
  | TObject
  | null
  | number;
export type NextFunction = (
  err?: Error,
) => TRet;
export type RetHandler =
  | Promise<void | string | TObject>
  | void
  | string
  | TObject;
export type Handler<
  Rev extends RequestEvent = RequestEvent,
> = (
  rev: Rev,
  next: NextFunction,
  ...args: TRet
) => RetHandler;

export type Handlers<
  Rev extends RequestEvent = RequestEvent,
> = Array<Handler<Rev> | Handler<Rev>[]>;

export type TBodyParser = {
  json?: number | string | boolean;
  urlencoded?: number | string | boolean;
  raw?: number | string | boolean;
  multipart?: number | string | boolean;
};

export type TSizeList = {
  b: number;
  kb: number;
  mb: number;
  gb: number;
  tb: number;
  pb: number;
  [key: string]: unknown;
};

export type Cookie = {
  expires?: Date;
  maxAge?: number;
  domain?: string;
  path?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: "Strict" | "Lax" | "None";
  other?: string[];
  encode?: boolean;
};
export type TQueryFunc = TRet;
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
   * custom bodyLimit or disable bodyParser. default to `3mb`/content-type.
   * @deprecated
   * Use bodyParser instead.
   * @example
   * const app = nhttp({
   *   bodyParser: {
   *      // disable json body
   *      json: false,
   *      // custom limit for urlencoded
   *      urlencoded: "1mb"
   *   }
   * })
   */
  bodyLimit?: TBodyParser;
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
   * flash server for `Deno`. default to false.
   *
   * `note: if flash is stable, will remove this flag`.
   * @example
   * const app = nhttp({
   *   flash: true
   * })
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
export type FetchEvent = TRet;

export type RouterOrWare<
  Rev extends RequestEvent = RequestEvent,
> =
  | Handler<Rev>
  | Handler<Rev>[]
  | Router<Rev>
  | Router<Rev>[]
  | TObject
  | TObject[];

export type CustomHandler = (request: Request, ...args: TRet) => TRet;

export type ListenOptions = {
  port: number;
  hostname?: string;
  key?: string;
  cert?: string;
  keyFile?: string;
  certFile?: string;
  transport?: string;
  alpnProtocols?: string[];
  handler?: CustomHandler;
  signal?: AbortSignal;
  [k: string]: TRet;
};

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

export type MatchRoute = {
  method: string;
  params: TObject;
  path: string | RegExp;
  query: TObject;
  pattern: RegExp;
  wild: boolean;
};
