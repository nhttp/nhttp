// fetch.ts
/**
 * @module
 *
 * This module contains fetch-API (`Request`, `Response`, `fetch`) for nodejs with NHttp.
 */
import type { TObject, TRet } from "../../../src/types.ts";
import { NodeRequest } from "./request.ts";
import { NodeResponse } from "./response.ts";

/**
 * install Fetch-API.
 */
export function install() {
  const global = globalThis as TObject;
  if (global.NativeFetch === void 0) {
    global.NativeResponse = global.Response;
    global.NativeRequest = global.Request;
    global.NativeFetch = global.fetch;
    global.fetch = async function fetch(
      input: RequestInfo | URL,
      init?: RequestInit,
    ): Promise<Response> {
      if ((<TRet> globalThis).NativeFetch === void 0) {
        return await fetch(input, init);
      }
      if (input instanceof Request) {
        init = input;
        input = input.url;
      }
      const res: TObject = await (<TRet> globalThis).NativeFetch(
        input,
        init,
      );
      res._url = input instanceof URL ? input.href : (input as string);
      return new Response(res.body, res);
    };
    global.Response = class Response extends NodeResponse {
      /**
       * perf v8 instanceof `Response`.
       */
      get [Symbol.hasInstance](): string {
        return "Response";
      }
    };
    global.Request = class Request extends NodeRequest {
      /**
       * perf v8 instanceof `Request`.
       */
      get [Symbol.hasInstance](): string {
        return "Request";
      }
    };
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
