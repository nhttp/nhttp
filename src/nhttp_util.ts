// nhttp_util.ts
import type { RequestEvent } from "./request_event.ts";
import { s_response, s_undefined } from "./symbol.ts";
import type {
  BuildListenOptions,
  FetchHandler,
  ListenOptions,
  NextFunction,
  TRet,
} from "./types.ts";
/**
 * create awaiter from requestEvent.
 */
export const awaiter = (rev: RequestEvent): Promise<TRet> | undefined => {
  if (rev[s_undefined]) return;
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
/**
 * helpers next function.
 */
export const onNext = async (
  ret: TRet,
  rev: RequestEvent,
  next: NextFunction,
): Promise<TRet> => {
  try {
    await rev.send(await ret, 1);
    return rev[s_response] ?? awaiter(rev);
  } catch (error) {
    return next(error);
  }
};
/**
 * helper to create options when listen the server.
 */
export function buildListenOptions(
  this: TRet,
  opts?: number | ListenOptions,
): BuildListenOptions {
  let handler: FetchHandler = this.handleRequest;
  if (typeof opts === "undefined") opts = { port: 8000 };
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
