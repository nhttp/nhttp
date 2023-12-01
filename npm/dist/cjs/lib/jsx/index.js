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
  dangerHTML: () => dangerHTML,
  h: () => n,
  n: () => n
});
module.exports = __toCommonJS(jsx_exports);
var import_helmet = require("./helmet");
__reExport(jsx_exports, require("./render"), module.exports);
__reExport(jsx_exports, require("./helmet"), module.exports);
const dangerHTML = "dangerouslySetInnerHTML";
const Fragment = ({ children }) => children;
function n(type, props, ...children) {
  if (children.length > 0) {
    return { type, props: { ...props, children }, key: null };
  }
  return { type, props, key: null };
}
n.Fragment = Fragment;
const Client = (props) => {
  return n(Fragment, {}, [
    n(
      import_helmet.Helmet,
      { footer: true },
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
  dangerHTML,
  h,
  n,
  ...require("./render"),
  ...require("./helmet")
});
