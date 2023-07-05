// deno-lint-ignore-file no-explicit-any ban-types
import { RequestEvent } from "./request_event.ts";
import Router from "./router.ts";
/* eslint-disable  @typescript-eslint/no-explicit-any */
export type TRet = any;
/* eslint-disable  @typescript-eslint/ban-types */
export type EObject = {};
export type TObject = { [k: string]: TRet };
declare global {
  interface Request {
    _info?: { conn?: TRet; ctx?: TRet };
  }
  interface BigInt {
    toJSON: () => string;
  }
}

export type Merge<A, B> = {
  [K in keyof (A & B)]: (
    K extends keyof B ? B[K]
      : (K extends keyof A ? A[K] : never)
  );
};

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
) => Promise<Response>;
export type RetHandler =
  | Promise<void | string | TObject | number>
  | void
  | string
  | TObject
  | number;
export type Handler<
  T = EObject,
  Rev extends RequestEvent = RequestEvent,
> = (
  rev: Merge<Rev, T>,
  next: NextFunction,
  ...args: TRet
) => RetHandler;

export type Handlers<
  T = EObject,
  Rev extends RequestEvent = RequestEvent,
> = Array<Handler<T, Rev> | Handler<T, Rev>[]>;

export type TValidBody = number | string | false | undefined;

export type TBodyParser = {
  json?: TValidBody;
  urlencoded?: TValidBody;
  raw?: TValidBody;
  multipart?: TValidBody;
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
   * @deprecated
   * Flash server now stable.
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
  T extends unknown = unknown,
  Rev extends RequestEvent = RequestEvent,
> =
  | Handler<T, Rev>
  | Handler<T, Rev>[]
  | Router<Rev>
  | Router<Rev>[]
  | TObject
  | TObject[];

export type FetchHandler = (
  request: Request,
  ...args: TRet
) => Response | Promise<Response>;

export type ListenOptions = {
  port: number;
  fetch?: FetchHandler;
  hostname?: string;
  key?: string;
  cert?: string;
  keyFile?: string;
  certFile?: string;
  transport?: "tcp";
  alpnProtocols?: string[];
  handler?: FetchHandler;
  showInfo?: boolean;
  signal?: AbortSignal;
  [k: string]: TRet;
};
export interface NFile extends File {
  filename: string;
  path: string;
  pathfile: string;
  [k: string]: TRet;
}
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
  pathname: string;
  query: TObject;
  pattern: RegExp;
  wild: boolean;
};
