// util.ts
import type { TRet } from "../../../src/index.ts";

type ClassResponse = {
  prototype: Response;
  new (body?: BodyInit | null, init?: ResponseInit): Response;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Response/error_static) */
  error(): Response;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Response/json_static) */
  json(data: TRet, init?: ResponseInit): Response;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Response/redirect_static) */
  redirect(url: string | URL, status?: number): Response;
};
type CRequest = {
  prototype: Request;
  new (input: RequestInfo | URL, init?: RequestInit): Request;
};
/**
 * get class native Response.
 */
export const getClassResponse = (): ClassResponse => {
  return (<TRet> globalThis).NativeResponse !== void 0
    ? (<TRet> globalThis).NativeResponse
    : (<TRet> globalThis).Response;
};
/**
 * get class native Response.
 */
export const getClassRequest = (): CRequest => {
  return (<TRet> globalThis).NativeRequest !== void 0
    ? (<TRet> globalThis).NativeRequest
    : (<TRet> globalThis).Request;
};
/**
 * fast check response no-stream.
 */
export const R_NO_STREAM: RegExp = /\/json|\/plain|\/html|\/css|\/javascript/;
/**
 * content-type constants.
 */
export const C_TYPE: string = "Content-Type";
/**
 * content-type `application/json`.
 */
export const JSON_TYPE: string = "application/json";
/**
 * check data is Array.
 */
export const isArray: (arg: TRet) => arg is TRet[] = Array.isArray;
