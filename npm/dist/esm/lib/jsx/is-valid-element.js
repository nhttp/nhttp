const isFunc = (v) => typeof v === "function";
const isArray = Array.isArray;
function isValidElement(elem) {
  if (typeof elem === "object") {
    if (elem == null || elem instanceof Response)
      return false;
    if (isArray(elem))
      elem = elem[0] ?? {};
    if (elem.__n__ || isFunc(elem.type))
      return true;
    const has = (k) => Object.hasOwn(elem, k);
    if (has("type") && has("props") && has("key"))
      return true;
  }
  return false;
}
export {
  isValidElement
};
