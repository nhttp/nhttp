const isValidElement = (elem) => {
  if (typeof elem === "string" && elem[0] === "<")
    return true;
  if (typeof elem === "object") {
    if (typeof elem.type === "function")
      return true;
    const has = (k) => Object.hasOwn(elem, k);
    if (has("type") && has("props") && has("key"))
      return true;
  }
  return false;
};
export {
  isValidElement
};
