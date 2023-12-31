var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var jsx_exports = {};
__export(jsx_exports, {
  Client: () => Client,
  Fragment: () => Fragment,
  Helmet: () => import_helmet2.Helmet,
  Suspense: () => import_render.Suspense,
  dangerHTML: () => dangerHTML,
  escapeHtml: () => import_render.escapeHtml,
  h: () => n,
  isValidElement: () => import_render.isValidElement,
  n: () => n,
  options: () => import_render.options,
  renderToHtml: () => import_render.renderToHtml,
  renderToReadableStream: () => import_render.renderToReadableStream,
  renderToString: () => import_render.renderToString,
  toStyle: () => import_render.toStyle
});
module.exports = __toCommonJS(jsx_exports);
var import_helmet = require("./helmet");
var import_render = require("./render");
var import_helmet2 = require("./helmet");
__reExport(jsx_exports, require("./hook"), module.exports);
__reExport(jsx_exports, require("./types"), module.exports);
__reExport(jsx_exports, require("./htmx"), module.exports);
const dangerHTML = "dangerouslySetInnerHTML";
const Fragment = ({ children }) => children;
function n(type, props, ...children) {
  return {
    type,
    props: children.length > 0 ? { ...props, children } : props,
    key: null,
    // fast check nhttp jsx
    __n__: true
  };
}
n.Fragment = Fragment;
const Client = (props) => {
  props.footer ??= true;
  return n(Fragment, {}, [
    n(
      import_helmet.Helmet,
      { footer: props.footer },
      n(
        "script",
        { src: props.src }
      )
    ),
    n(props.type ?? "div", { id: props.id }, props.children)
  ]);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Client,
  Fragment,
  Helmet,
  Suspense,
  dangerHTML,
  escapeHtml,
  h,
  isValidElement,
  n,
  options,
  renderToHtml,
  renderToReadableStream,
  renderToString,
  toStyle,
  ...require("./hook"),
  ...require("./types"),
  ...require("./htmx")
});
