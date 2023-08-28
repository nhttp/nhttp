var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var render_exports = {};
__export(render_exports, {
  isValidElement: () => import_is_valid_element.isValidElement,
  options: () => options,
  renderToHtml: () => renderToHtml,
  renderToString: () => renderToString
});
module.exports = __toCommonJS(render_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  isValidElement,
  options,
  renderToHtml,
  renderToString
});
