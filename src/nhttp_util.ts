import { RequestEvent } from "./request_event.ts";
import { s_response } from "./symbol.ts";
import { FetchHandler, ListenOptions, TRet } from "./types.ts";

export const awaiter = (rev: RequestEvent) => {
  let t: undefined | number;
  const sleep = (ms: number) => {
    return new Promise<void>((ok) => {
      clearTimeout(t);
      t = setTimeout(ok, ms);
    });
  };
  return (async (a, b, c) => {
    while (rev[s_response] === void 0) {
      await sleep(a * c);
      if (a === b) {
        clearTimeout(t);
        break;
      }
      a++;
    }
    return rev[s_response] ?? new Response(null, { status: 408 });
  })(0, 10, 200);
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
