import { options } from "./index.js";
const isArray = Array.isArray;
const isValidElement = (elem) => {
  if (elem == null)
    return false;
  if (typeof elem === "object") {
    if (isArray(elem))
      elem = elem[0] ?? {};
    if (typeof elem.type === "function")
      return true;
    const has = (k) => Object.hasOwn(elem, k);
    if (has("type") && has("props") && has("key"))
      return true;
  }
  if (options.precompile && typeof elem === "string")
    return true;
  return false;
};
export {
  isValidElement
};
