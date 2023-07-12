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
  options: () => options,
  renderToHtml: () => renderToHtml,
  renderToString: () => renderToString
});
var import_helmet = __toESM(require("./helmet"), 1);
var import_index = require("./index");
var import_is_valid_element = require("./is-valid-element");
const renderToString = (elem) => elem;
const options = {
  onRenderHtml: (html) => html,
  onRenderElement: renderToString
};
const toHtml = (body, { head, footer, attr }) => {
  return "<!DOCTYPE html>" + (0, import_index.n)("html", { lang: "en", ...attr.html.toJSON() }, [
    (0, import_index.n)("head", {}, [
      (0, import_index.n)("meta", { charset: "utf-8" }),
      (0, import_index.n)("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1.0"
      }),
      head
    ]),
    (0, import_index.n)("body", attr.body.toJSON(), [body, footer])
  ]);
};
const renderToHtml = (elem, rev) => {
  const body = options.onRenderElement(elem, rev);
  const render = (str) => {
    return options.onRenderHtml(toHtml(str, import_helmet.default.rewind()), rev);
  };
  if (body instanceof Promise)
    return body.then(render);
  return render(body);
};
renderToHtml.check = import_is_valid_element.isValidElement;
module.exports = __toCommonJS(render_exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  options,
  renderToHtml,
  renderToString
});
