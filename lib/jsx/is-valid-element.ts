import type { TRet } from "../deps.ts";
import { options } from "./index.ts";

const isArray = Array.isArray;
/**
 * isValidElement.
 * @example
 * const bool = isValidElement(<App />);
 */
export const isValidElement = (elem: TRet) => {
  if (elem == null) return false;
  if (typeof elem === "object") {
    if (isArray(elem)) elem = elem[0] ?? {};
    if (typeof elem.type === "function") return true;
    const has = (k: string) => Object.hasOwn(elem, k);
    if (has("type") && has("props") && has("key")) return true;
  }
  if (options.precompile && typeof elem === "string") return true;
  return false;
};
