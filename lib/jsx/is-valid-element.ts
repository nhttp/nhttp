import type { TRet } from "../deps.ts";

const isFunc = <T>(v: T) => typeof v === "function";
const isArray = Array.isArray;
/**
 * isValidElement.
 * @example
 * const bool = isValidElement(<App />);
 */
export function isValidElement(elem: TRet) {
  if (typeof elem === "object") {
    if (elem == null || elem instanceof Response) return false;
    if (isArray(elem)) elem = elem[0] ?? {};
    if (elem.__n__ || isFunc(elem.type)) return true;
    const has = (k: string) => Object.hasOwn(elem, k);
    if (has("type") && has("props") && has("key")) return true;
  }
  return false;
}
