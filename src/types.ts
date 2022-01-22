import { RequestEvent } from "./request_event.ts";
import Router from "./router.ts";

// deno-lint-ignore no-explicit-any
export type TRet = any;
export type NextFunction = (err?: Error) => TRet;
export type TObject = { [k: string]: TRet };
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
) => RetHandler;

export type Handlers<
  Rev extends RequestEvent = RequestEvent,
> = Array<Handler<Rev> | Handler<Rev>[]>;

export type TBodyLimit = {
  json?: number | string;
  urlencoded?: number | string;
  raw?: number | string;
  multipart?: number | string;
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
  parseQuery?: TQueryFunc;
  bodyLimit?: TBodyLimit;
  env?: string;
};
export type FetchEvent = TRet;

export type RouterOrWare<
  Rev extends RequestEvent = RequestEvent,
> = Handler<Rev> | Handler<Rev>[] | Router<Rev> | Router<Rev>[];
