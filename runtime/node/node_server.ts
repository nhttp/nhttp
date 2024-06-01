// node_server.ts
import type { FetchHandler, ListenOptions, TObject } from "../../src/types.ts";
import { RuntimeServer } from "../runtime.ts";
import { serveNode } from "./fetch/index.ts";

/**
 * Server for Node runtime.
 */
export class NodeServer<T = TObject> extends RuntimeServer<T> {
  /**
   * create node server.
   */
  createServer = async (
    opts: ListenOptions,
    handler: FetchHandler,
    callback: (err?: Error | undefined) => number | undefined,
  ): Promise<T> => {
    try {
      this.onAbort(opts);
      this.server = await serveNode(handler, opts);
      callback();
      return this.server;
    } catch (error) {
      callback(error);
      return Promise.resolve(void 0) as Promise<T>;
    }
  };
}
