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
import { handleNode, mutateResponse, serveNode } from "./node/index.ts";
import { multipart as multi, TMultipartUpload } from "./src/multipart.ts";
import { ListenOptions } from "./src/types.ts";
import { buildListenOptions } from "./src/nhttp_util.ts";

export class NHttp<
  Rev extends RequestEvent = RequestEvent,
> extends BaseApp<Rev> {
  constructor(opts: TApp = {}) {
    super(opts);
    const oriHandle = this.handle.bind(this);
    this.handle = ((req: TRet, conn?: TRet, ctx?: TRet) => {
      if (req.on === void 0) return oriHandle(req, conn, ctx);
      mutateResponse();
      /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
      // @ts-ignore: immediate for nodejs
      setImmediate(() => handleNode(this.handleRequest, req, conn));
    }) as TRet;
    // @ts-ignore
    if (typeof Deno === "undefined") {
      this.listen = (options, callback) => {
        const { opts, handler } = buildListenOptions.bind(this)(options);
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
            return this.server;
          }
          return (async () => {
            try {
              this.server = await serveNode(handler, opts);
              runCallback();
              return this.server;
            } catch (error) {
              runCallback(error);
            }
          })();
        } catch (error) {
          runCallback(error);
        }
      };
    }
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
        if (opts[i].writeFile !== false) {
          if (opts[i].writeFile === true) opts[i].writeFile = void 0;
          opts[i].writeFile ??= writeFile;
        }
      }
    } else if (typeof opts === "object") {
      if (opts.writeFile !== false) {
        if (opts.writeFile === true) opts.writeFile = void 0;
        opts.writeFile ??= writeFile;
      }
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
