// index.ts
/**
 * @module
 *
 * NHttp - An Simple web-framework for Deno and Friends.
 *
 * @example
 * ```ts
 * import nhttp from "@nhttp/nhttp";
 *
 * const app = nhttp();
 *
 * app.get("/", (rev) => {
 *   return "hello world";
 * });
 *
 * app.listen(8000);
 * ```
 */
import { handleNode, serveNode } from "./runtime/node/fetch/index.ts";
import { NHttp as BaseApp } from "./src/nhttp.ts";
import type { RequestEvent, TApp, TRet } from "./src/index.ts";
import { default as BaseRouter, type TRouter } from "./src/router.ts";
import { multipart as multi, type TMultipartUpload } from "./src/multipart.ts";
import type { Handler, TObject } from "./src/types.ts";
import { buildListenOptions } from "./src/nhttp_util.ts";
import { defineCallback, isBun, isDeno, isNode } from "./runtime/runtime.ts";
import { writeFile } from "./runtime/node/node_fs.ts";
import { BunServer } from "./runtime/bun/bun_server.ts";
import { NodeServer } from "./runtime/node/node_server.ts";
/**
 * `class` NHttp.
 * @example
 * const app = new NHttp();
 *
 * app.get(path, ...handlers);
 *
 * app.listen(8000);
 */
export class NHttp<
  RuntimeServer = TObject,
  Rev extends RequestEvent = RequestEvent,
> extends BaseApp<RuntimeServer, Rev> {
  constructor(opts: TApp = {}) {
    super(opts);
    if (!isDeno()) {
      if (isBun()) {
        this.listen = (options, callback) => {
          const { opts, handler } = buildListenOptions.bind(this)(options);
          const runCallback = defineCallback(opts, callback);
          const bunServer = new BunServer<RuntimeServer>();
          this.server = bunServer.createServer(opts, handler, runCallback);
          return this.server;
        };
      } else if (isNode()) {
        this.handle = this.fetch = ((req: TRet, res: TRet) => {
          handleNode(this.handleRequest, req, res);
        }) as TRet;
        this.listen = (options, callback) => {
          const { opts, handler } = buildListenOptions.bind(this)(options);
          const runCallback = defineCallback(opts, callback);
          const nodeServer = new NodeServer<RuntimeServer>();
          return (async () => {
            this.server = await nodeServer.createServer(
              opts,
              handler,
              runCallback,
            ) as RuntimeServer;
            return this.server;
          })() as RuntimeServer;
        };
      } else {
        this.listen = (options, callback) => {
          const { opts } = buildListenOptions.bind(this)(options);
          const runCallback = defineCallback(opts, callback);
          runCallback();
          return this.serve(opts) as RuntimeServer;
        };
      }
    }
  }
}
/**
 * multipart for handle formdata.
 * @example
 * const upload = multipart.upload({ name: "image" });
 *
 * app.post("/save", upload, (rev) => {
 *    console.log("file", rev.file.image);
 *    console.log(rev.body);
 *    return "success upload";
 * });
 */
export const multipart = {
  /**
   * create body from formdata.
   */
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
  upload: (opts: TMultipartUpload | TMultipartUpload[]): Handler => {
    if (isDeno()) return multi.upload(opts);
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
/**
 * inital app.
 * @example
 * const app = nhttp();
 */
export function nhttp<
  RuntimeServer = TObject,
  Rev extends RequestEvent = RequestEvent,
>(
  opts: TApp = {},
): NHttp<RuntimeServer, Rev> {
  return new NHttp<RuntimeServer, Rev>(opts);
}
/**
 * Router
 * @example
 * const router = nhttp.Router();
 * const router = nhttp.Router({ base: '/items' });
 */
nhttp.Router = function <Rev extends RequestEvent = RequestEvent>(
  opts: TRouter = {},
): BaseRouter<Rev> {
  return new BaseRouter<Rev>(opts);
};
export { BunServer, NodeServer, serveNode };
export * from "./src/index.ts";

export default nhttp;
