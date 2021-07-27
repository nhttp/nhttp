import { HttpResponse } from "./http_response.ts";
import { RequestEvent } from "./request_event.ts";

export type NextFunction = (err?: Error) => void;
// deno-lint-ignore no-explicit-any
export type TObject = { [k: string]: any };
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

export type TWrapMiddleware = {
  /**
   * mutate RequestEvent or HttpResponse before wrap middleware
   */
  beforeWrap: (rev: RequestEvent, res: HttpResponse) => void;
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

// deno-lint-ignore no-explicit-any
export type TQueryFunc = (data: string | unknown, ...args: any) => TObject;
