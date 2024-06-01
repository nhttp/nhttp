// headers.ts
import { s_inspect } from "./symbol.ts";
import type { TRet } from "../../../src/types.ts";

/**
 * Headers web-api
 */
export class NodeHeaders {
  constructor(
    /**
     * initial Headers
     */
    public headers: Headers,
  ) {}
  /**
   * custom inspect Headers
   */
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
