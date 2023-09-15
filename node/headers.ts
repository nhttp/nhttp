import { s_inspect } from "./symbol.ts";
import { TRet } from "../index.ts";

export class NodeHeaders {
  constructor(public headers: Headers) {}
  [s_inspect](
    depth: number,
    opts: TRet,
    inspect: TRet,
  ) {
    opts.depth = depth;
    const headers = {} as TRet;
    this.headers.forEach((v, k) => {
      headers[k] = v;
    });
    return `Headers ${inspect(headers, opts)}`;
  }
}
