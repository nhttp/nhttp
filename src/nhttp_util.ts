import { RequestEvent } from "./request_event.ts";
import { s_response } from "./symbol.ts";
import { ListenOptions, NextFunction, TRet } from "./types.ts";

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

export const onNext = (
  ret: TRet,
  rev: RequestEvent,
  next: NextFunction,
) => {
  if (ret?.then) {
    return (async () => {
      try {
        rev.send(await ret, 1);
        return rev[s_response] ?? awaiter(rev);
      } catch (e) {
        return next(e);
      }
    })();
  }
  rev.send(ret, 1);
  return rev[s_response] ?? awaiter(rev);
};

export function buildListenOptions(this: TRet, opts: number | ListenOptions) {
  let isSecure = false;
  if (typeof opts === "number") {
    opts = { port: opts };
  } else if (typeof opts === "object") {
    isSecure = opts.certFile !== void 0 ||
      opts.cert !== void 0 ||
      opts.alpnProtocols !== void 0;
    if (opts.handler) this.handle = opts.handler;
  }
  return { opts, isSecure };
}

export function closeServer(this: TRet) {
  try {
    if (!this.alive) {
      throw new Error("Server Closed");
    }
    this.alive = false;
    this.server.close();
    for (const httpConn of this.track) {
      httpConn.close();
    }
    this.track.clear();
  } catch { /* noop */ }
}
