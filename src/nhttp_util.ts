import { RequestEvent } from "./request_event.ts";
import { s_response } from "./symbol.ts";
import { FetchHandler, ListenOptions, NextFunction, TRet } from "./types.ts";

export const awaiter = (rev: RequestEvent) => {
  return (async (t, d) => {
    while (rev[s_response] === void 0) {
      await new Promise((ok) => setTimeout(ok, t));
      if (t === d) break;
      t++;
    }
    return rev[s_response];
  })(0, 100);
};
export const onNext = async (
  ret: TRet,
  rev: RequestEvent,
  next: NextFunction,
) => {
  try {
    rev.send(await ret, 1);
    return rev[s_response] ?? awaiter(rev);
  } catch (e) {
    return next(e);
  }
};
export function buildListenOptions(this: TRet, opts: number | ListenOptions) {
  let isSecure = false;
  let handler: FetchHandler = this.handleRequest;
  if (typeof opts === "number") {
    opts = { port: opts };
  } else if (typeof opts === "object") {
    isSecure = opts.certFile !== void 0 ||
      opts.cert !== void 0 ||
      opts.alpnProtocols !== void 0;
    handler = opts.handler ?? opts.fetch ??
      (opts.showInfo ? this.handle : this.handleRequest);
    if (opts.handler) delete opts.handler;
    if (opts.fetch) delete opts.fetch;
  }
  return { opts, isSecure, handler };
}

export class HttpServer {
  private alive = true;
  private track = new Set<TRet>();
  constructor(public listener: TRet, public handle: FetchHandler) {}
  async acceptConn() {
    while (this.alive) {
      let conn: Deno.Conn;
      try {
        conn = await this.listener.accept();
      } catch {
        break;
      }
      let httpConn: Deno.HttpConn;
      try {
        httpConn = Deno.serveHttp(conn);
      } catch {
        continue;
      }
      this.track.add(httpConn);
      this.handleHttp(httpConn, conn);
    }
  }
  close() {
    try {
      if (!this.alive) {
        throw new Error("Server Closed");
      }
      this.alive = false;
      this.listener.close();
      for (const t of this.track) t.close();
      this.track.clear();
    } catch { /* noop */ }
  }
  async handleHttp(httpConn: Deno.HttpConn, conn: Deno.Conn) {
    for (;;) {
      try {
        const rev = await httpConn.nextRequest();
        if (rev) {
          await rev.respondWith(this.handle(rev.request, conn));
        } else {
          break;
        }
      } catch {
        break;
      }
    }
  }
}
