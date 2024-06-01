// cors.ts
/**
 * @module
 *
 * This module contains cors (Cross Origin Resource Sharing) middlewares for NHttp.
 *
 * @example
 * ```tsx
 * import nhttp from "@nhttp/nhttp";
 * import cors from "@nhttp/nhttp/cors";
 *
 * const app = nhttp();
 *
 * app.use(cors());
 *
 * app.get("/", (rev) => {
 *   return "hello with cors";
 * });
 *
 * app.listen(8000);
 * ```
 */
import type { Handler, RequestEvent, TRet } from "./deps.ts";

/**
 * `type` CorsOptions.
 */
export type CorsOptions = {
  /**
   * origin url.
   */
  origin?:
    | string
    | string[]
    | boolean
    | ((rev: RequestEvent) => Promise<boolean | string> | boolean | string);
  /**
   * allow credentials.
   */
  credentials?: boolean;
  /**
   * allowed headers.
   */
  allowHeaders?: string | string[];
  /**
   * allowed methods.
   */
  allowMethods?: string | string[];
  /**
   * expose headers.
   */
  exposeHeaders?: string | string[];
  /**
   * custom headers.
   */
  customHeaders?: Record<string, string>;
  /**
   * options status-code.
   */
  optionsStatus?: number;
  /**
   * max-age headers.
   */
  maxAge?: number;
  /**
   * preflight on next.
   */
  preflightNext?: boolean;
};
/**
 * Cors middleware.
 * @example
 * app.use(cors());
 */
export const cors = (opts: CorsOptions = {}): Handler => {
  opts.optionsStatus ??= 204;
  opts.preflightNext ??= false;
  opts.allowMethods ??= "GET,HEAD,PUT,PATCH,POST,DELETE";
  let origin = opts.origin ?? "*";
  const createOrigin = async (rev: RequestEvent) => {
    let isCheck = false;
    if (typeof origin === "function") {
      origin = await origin(rev);
      if (origin !== false) {
        rev.response.setHeader("vary", "Origin");
      }
      isCheck = true;
    }
    if (origin !== false) {
      if (origin === true) origin = "*";
      if (!isCheck && origin !== "*") {
        const reqOrigin = rev.request.headers.get("origin");
        if (reqOrigin !== null) {
          origin = origin.includes(reqOrigin) ? reqOrigin : "";
          rev.response.setHeader("vary", "Origin");
        } else {
          origin = "";
        }
      }
      if (origin.length) {
        rev.response.setHeader(
          "access-control-allow-origin",
          origin.toString(),
        );
      }
    }
  };
  return async (rev, next) => {
    await createOrigin(rev);
    const { response, request } = rev;
    if (opts.credentials) {
      response.setHeader("access-control-allow-credentials", "true");
    }
    if (opts.exposeHeaders !== void 0) {
      response.setHeader(
        "access-control-expose-headers",
        opts.exposeHeaders.toString(),
      );
    }
    if (opts.customHeaders) response.header(opts.customHeaders);
    if (request.method === "OPTIONS") {
      // preflight
      const allowHeaders = opts.allowHeaders ?? request.headers.get(
        "access-control-request-headers",
      ) ?? "";
      if (allowHeaders.length) {
        response.setHeader(
          "access-control-allow-headers",
          allowHeaders.toString(),
        );
        response.header().append("vary", "Access-Control-Request-Headers");
      }
      if (opts.allowMethods?.length) {
        response.setHeader(
          "access-control-allow-methods",
          opts.allowMethods.toString(),
        );
      }
      if (opts.maxAge !== void 0) {
        response.setHeader(
          "access-control-max-age",
          opts.maxAge.toString(),
        );
      }
      if (opts.preflightNext) return next();
      response.status(opts.optionsStatus ?? 204);
      return <TRet> null;
    }
    return next();
  };
};

export default cors;
