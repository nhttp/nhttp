import { TRet } from "../deps.ts";
import { options } from "./index.ts";

/**
 * isValidElement.
 * @example
 * const bool = isValidElement(<App />);
 */
export const isValidElement = (elem: TRet) => {
  if (typeof elem === "object") {
    if (typeof elem.type === "function") return true;
    const has = (k: string) => Object.hasOwn(elem, k);
    if (has("type") && has("props") && has("key")) return true;
  }
  if (
    options.precompile && typeof elem === "string" && elem[0] === "<"
  ) {
    return true;
  }
  return false;
};
