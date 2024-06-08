// serve-static.ts
/**
 * @module
 *
 * This module contains serve assets (serve static files) for NHttp.
 *
 * @example
 * ```tsx
 * import nhttp from "@nhttp/nhttp";
 * import serveStatic from "@nhttp/nhttp/serve-static";
 *
 * const app = nhttp();
 *
 * app.use(serveStatic("./my_dir", options));
 *
 * // or with prefix
 * // app.use(serveStatic("./my_dir", { prefix: "/assets" }));
 *
 * // or with prefix path
 * // app.use("/assets", serveStatic("./my_dir"));
 *
 * app.listen(8000);
 * ```
 */
import { decURIComponent, type Handler, type TRet } from "./deps.ts";
import { sendFile as sendFileEtag, type TOptsSendFile } from "./etag.ts";

/**
 * `interface` ServeStaticOptions.
 */
export interface ServeStaticOptions extends TOptsSendFile {
  /**
   * target redirect. default to `index.html`.
   */
  index?: string;
  /**
   * config redirect. default to `true`.
   */
  redirect?: boolean;
  /**
   * prefix assets.
   */
  prefix?: string;
  /**
   * support for single-page-apps.
   */
  spa?: boolean;
  /**
   * custom readFile.
   */
  readFile?: (...args: TRet) => TRet;
}
/**
 * send file with etag.
 */
export const sendFile = sendFileEtag;
/**
 * serve-static middleware.
 * @example
 * app.use(serveStatic("./my_dir", options));
 *
 * // prefix
 * app.use(serveStatic("./my_dir", { prefix: "/assets" }));
 * // or
 * // app.use("/assets", serveStatic("./my_dir"));
 */
export function serveStatic(
  dir: string | URL,
  opts: ServeStaticOptions = {},
): Handler {
  opts.index ??= "index.html";
  opts.redirect ??= true;
  opts.etag ??= false;
  if (dir instanceof URL) dir = dir.pathname;
  if (dir.endsWith("/")) dir = dir.slice(0, -1);
  const hasFileUrl = dir.startsWith("file://");
  const index = opts.redirect ? opts.index : "";
  let prefix = opts.prefix as string;
  const hasPrefix = prefix !== void 0 && prefix !== "/";
  if (hasPrefix) {
    if (prefix[0] !== "/") prefix = "/" + prefix;
    if (prefix.endsWith("/")) prefix = prefix.slice(0, -1);
  }
  if (hasFileUrl) dir = new URL(dir).pathname;
  return async (rev, next) => {
    if (rev.method === "GET" || rev.method === "HEAD") {
      try {
        let path = rev.path;
        if (hasPrefix) {
          if (path.startsWith(prefix) === false) return next();
          path = path.substring(prefix.length);
          if (path !== "" && path[0] !== "/") return next();
        }
        let pathFile = dir + path;
        if (opts.redirect) {
          const idx = pathFile.lastIndexOf(".");
          if (pathFile.slice((idx - 1 >>> 0) + 2) === "") {
            if (pathFile.endsWith("/")) pathFile += index;
            else pathFile += "/" + index;
          }
        }
        return await sendFile(rev, decURIComponent(pathFile), opts);
      } catch {
        if (opts.spa && opts.redirect) {
          try {
            return await sendFile(
              rev,
              decURIComponent(dir + "/" + index),
              opts,
            );
          } catch { /* noop */ }
        }
      }
    }
    return next();
  };
}

export default serveStatic;
