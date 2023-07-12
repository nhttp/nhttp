import { RequestEvent } from "./request_event.ts";
import { s_response } from "./symbol.ts";
import { FetchHandler, ListenOptions, TRet } from "./types.ts";

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

export function buildListenOptions(this: TRet, opts: number | ListenOptions) {
  let handler: FetchHandler = this.handleRequest;
  if (typeof opts === "number") {
    opts = { port: opts };
  } else if (typeof opts === "object") {
    handler = opts.handler ?? opts.fetch ??
      (opts.showInfo ? this.handle : this.handleRequest);
    if (opts.handler) delete opts.handler;
    if (opts.fetch) delete opts.fetch;
  }
  return { opts, handler };
}
