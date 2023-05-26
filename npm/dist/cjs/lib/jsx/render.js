var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, copyDefault, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && (copyDefault || key !== "default"))
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toESM = (module2, isNodeMode) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", !isNodeMode && module2 && module2.__esModule ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
var __toCommonJS = /* @__PURE__ */ ((cache) => {
  return (module2, temp) => {
    return cache && cache.get(module2) || (temp = __reExport(__markAsModule({}), module2, 1), cache && cache.set(module2, temp), temp);
  };
})(typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : 0);
var render_exports = {};
__export(render_exports, {
  isValidElement: () => isValidElement,
  options: () => options,
  renderToHtml: () => renderToHtml,
  renderToString: () => renderToString
});
var import_helmet = __toESM(require("./helmet"), 1);
const renderToString = (elem) => elem;
const options = {
  onRenderHtml: (html) => html,
  onRenderElement: renderToString
};
const toHtml = (body, { bodyTag, headTag, htmlAttr, bodyAttr }) => {
  return `<!DOCTYPE html><html${htmlAttr ? ` ${htmlAttr}` : ""}><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">${headTag ? `${headTag.join("")}` : ""}</head><body${bodyAttr ? ` ${bodyAttr}` : ""}>${body}${bodyTag ? `${bodyTag.join("")}` : ""}</body></html>`;
};
const renderToHtml = (elem) => {
  const body = options.onRenderElement(elem);
  return options.onRenderHtml(toHtml(body, import_helmet.default.rewind()));
};
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
renderToHtml.check = isValidElement;
module.exports = __toCommonJS(render_exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  isValidElement,
  options,
  renderToHtml,
  renderToString
});
