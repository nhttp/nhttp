// deno-lint-ignore-file
declare global {
  var bunServer: { reload: (...args: TRet) => TRet };
  // @ts-ignore
  namespace Deno {
    interface Conn {}
    interface HttpConn {}
  }
}
import { NHttp as BaseApp } from "./src/nhttp.ts";
import { RequestEvent, TApp, TRet } from "./src/index.ts";
import Router, { TRouter } from "./src/router.ts";
import { serveNode } from "./node/index.ts";
import { multipart as multi, TMultipartUpload } from "./src/multipart.ts";
import { ListenOptions } from "./src/types.ts";

export class NHttp<
  Rev extends RequestEvent = RequestEvent,
> extends BaseApp<Rev> {
  constructor(opts: TApp = {}) {
    super(opts);
    const oriListen = this.listen.bind(this);
    this.listen = async (opts, callback) => {
      // @ts-ignore
      if (typeof Deno !== "undefined") {
        return oriListen(opts, callback);
      }
      let handler = this.handle;
      if (typeof opts === "number") {
        opts = { port: opts };
      } else if (typeof opts === "object") {
        if (opts.handler) handler = opts.handler;
      }
      const runCallback = (err?: Error) => {
        if (callback) {
          const _opts = opts as TRet;
          callback(err, {
            ..._opts,
            hostname: _opts.hostname || "localhost",
          });
        }
      };
      try {
        if (opts.signal) {
          opts.signal.addEventListener("abort", () => {
            try {
              this.server?.close?.();
              this.server?.stop?.();
            } catch { /* noop */ }
          }, { once: true });
        }
        // @ts-ignore
        if (typeof Bun !== "undefined") {
          opts.fetch = handler;
          if (!globalThis.bunServer) {
            // @ts-ignore
            globalThis.bunServer = this.server = Bun.serve(opts);
            runCallback();
          } else {
            globalThis.bunServer.reload(opts);
          }
          return;
        }
        this.server = await serveNode(handler, opts);
        runCallback();
        return;
      } catch (error) {
        runCallback(error);
      }
    };
  }

  module<Opts extends ListenOptions = ListenOptions>(
    opts: Opts = <TRet> {},
  ): TRet {
    opts.fetch ??= this.handle;
    return opts;
  }
}
let fs_glob: TRet;
const writeFile = async (...args: TRet) => {
  try {
    if (fs_glob) return fs_glob?.writeFileSync(...args);
    // @ts-ignore
    fs_glob = await import("node:fs");
    return fs_glob.writeFileSync(...args);
  } catch (_e) { /* noop */ }
  fs_glob = {};
  return void 0;
};
export const multipart = {
  createBody: multi.createBody,
  /**
   * upload handler multipart/form-data.
   * @example
   * const upload = multipart.upload({ name: "image" });
   *
   * app.post("/save", upload, (rev) => {
   *    console.log("file", rev.file.image);
   *    console.log(rev.body);
   *    return "success upload";
   * });
   */
  upload: (opts: TMultipartUpload | TMultipartUpload[]) => {
    if (typeof Deno !== "undefined") return multi.upload(opts);
    if (Array.isArray(opts)) {
      for (let i = 0; i < opts.length; i++) {
        opts[i].writeFile ??= writeFile;
      }
    } else if (typeof opts === "object") {
      opts.writeFile ??= writeFile;
    }
    return multi.upload(opts);
  },
};
export function nhttp<Rev extends RequestEvent = RequestEvent>(
  opts: TApp = {},
) {
  return new NHttp<Rev>(opts);
}

nhttp.Router = function <Rev extends RequestEvent = RequestEvent>(
  opts: TRouter = {},
) {
  return new Router<Rev>(opts);
};
export { serveNode };
export * from "./src/index.ts";

export default nhttp;
