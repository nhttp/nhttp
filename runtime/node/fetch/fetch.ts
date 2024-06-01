// fetch.ts
import type { TRet } from "../../../src/types.ts";
import { NodeRequest } from "./request.ts";
import { NodeResponse } from "./response.ts";

/**
 * create Fetch-API.
 */
export function createFetch() {
  if ((<TRet> globalThis).NativeResponse === undefined) {
    (<TRet> globalThis).NativeResponse = Response;
    (<TRet> globalThis).NativeRequest = Request;
    (<TRet> globalThis).NativeFetch = fetch;
    (<TRet> globalThis).fetch = (
      input: RequestInfo | URL,
      init?: RequestInit,
    ) => {
      if (input instanceof Request) {
        init = input;
        input = input.url;
      }
      return (async () => {
        const res: Response = await (<TRet> globalThis).NativeFetch(
          input,
          init,
        );
        const ret = new (<TRet> globalThis).Response(
          res.body,
          res,
          void 0,
          input instanceof URL ? input.href : input,
        );
        ret._nres = void 0;
        return ret;
      })();
    };
    (<TRet> globalThis).Response = class Response extends NodeResponse {};
    (<TRet> globalThis).Request = class Request extends NodeRequest {};
  }
}
