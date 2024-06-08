// bun_server.ts
import type { FetchHandler, ListenOptions, TObject } from "../../src/types.ts";
import { RuntimeServer } from "../runtime.ts";

declare const Bun: TObject;

/**
 * Server for Bun runtime.
 */
export class BunServer<T = TObject> extends RuntimeServer<T> {
  /**
   * create bun server.
   */
  createServer = (
    opts: ListenOptions,
    handler: FetchHandler,
    callback: (err?: Error | undefined) => number | undefined,
  ): T => {
    opts.fetch = handler;
    try {
      this.onAbort(opts);
      this.server = Bun.serve(opts);
      callback();
      return this.server as T;
    } catch (error) {
      callback(error);
      return void 0 as T;
    }
  };
}
