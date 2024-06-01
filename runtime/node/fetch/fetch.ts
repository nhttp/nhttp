// fetch.ts
/**
 * @module
 *
 * This module contains fetch-API (`Request`, `Response`, `fetch`) for nodejs with NHttp.
 */
import type { TObject, TRet } from "../../../src/types.ts";
import { isNode } from "../../runtime.ts";
import { NodeRequest } from "./request.ts";
import { NodeResponse } from "./response.ts";
/**
 * This Fetch API interface represents a resource request.
 *
 * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Request)
 */
export class Request extends NodeRequest {
  /**
   * perf v8 instanceof `Request`.
   */
  get [Symbol.hasInstance](): string {
    return "Request";
  }
}
/**
 * This Fetch API interface represents the response to a request.
 *
 * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Response)
 */
export class Response extends NodeResponse {
  /**
   * perf v8 instanceof `Response`.
   */
  get [Symbol.hasInstance](): string {
    return "Response";
  }
}
/**
 * Fetch API.
 *
 * [MDN Reference](https://developer.mozilla.org/docs/Web/API/fetch)
 */
export async function fetch(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  if (input instanceof Request) {
    init = input;
    input = input.url;
  }
  const res: Response = await (<TRet> globalThis).NativeFetch(
    input,
    init,
  );
  const res_url = input instanceof URL ? input.href : (input as string);
  const ret = new Response(
    res.body,
    res,
    void 0,
    res_url,
  );
  return ret;
}

/**
 * install Fetch-API.
 */
export function install() {
  const global = globalThis as TObject;
  if (global.NativeFetch === void 0) {
    global.NativeResponse = global.Response;
    global.NativeRequest = global.Request;
    global.NativeFetch = global.fetch;
    global.fetch = fetch;
    global.Response = Response;
    global.Request = Request;
  }
}

/**
 * uninstall Fetch-API.
 */
export function uninstall() {
  const global = globalThis as TObject;
  if (global.NativeFetch !== void 0) {
    global.fetch = global.NativeFetch;
    global.Response = global.NativeResponse;
    global.Request = global.NativeRequest;
    global.NativeResponse = void 0;
    global.NativeRequest = void 0;
    global.NativeFetch = void 0;
  }
}

if (isNode()) install();
