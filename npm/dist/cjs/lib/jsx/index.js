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
  h: () => h,
  n: () => n
});
module.exports = __toCommonJS(jsx_exports);
var import_helmet = require("./helmet");
__reExport(jsx_exports, require("./render"), module.exports);
__reExport(jsx_exports, require("./helmet"), module.exports);
const dangerHTML = "dangerouslySetInnerHTML";
const isValue = (val) => val != null;
function escapeHtml(unsafe) {
  return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
const toStyle = (val) => {
  return Object.keys(val).reduce(
    (a, b) => a + b.split(/(?=[A-Z])/).join("-").toLowerCase() + ":" + (typeof val[b] === "number" ? val[b] + "px" : val[b]) + ";",
    ""
  );
};
function n(type, props, ...args) {
  props ??= {};
  if (isValue(props.children))
    args = args.concat(props.children);
  const children = args.flat().map((el) => typeof el === "number" ? String(el) : el).filter(Boolean);
  if (typeof type === "function") {
    if (children.length) {
      props.children = children.join("");
    }
    return type(props);
  }
  let elem = `<${type}`;
  for (const k in props) {
    let val = props[k];
    if (isValue(val) && k !== dangerHTML && k !== "children" && typeof val !== "function") {
      val = typeof val === "object" ? toStyle(val) : val === true ? "" : val === false ? null : val;
      if (isValue(val)) {
        let key = k.toLowerCase();
        if (key === "classname")
          key = "class";
        elem += ` ${key}${val === "" ? "" : `="${escapeHtml(val)}"`}`;
      }
    }
  }
  elem += ">";
  if (/area|base|br|col|embed|hr|img|input|keygen|link|meta|param|source|track|wbr/.test(type))
    return elem;
  if (props[dangerHTML]) {
    const val = props[dangerHTML].__html;
    elem += val;
  } else {
    children.forEach((child) => {
      if (isValue(child)) {
        if (typeof child === "string")
          elem += child;
        else if (child.pop)
          elem += child.join("");
      }
    });
  }
  return elem += type ? `</${type}>` : "";
}
function h(type, props, ...args) {
  return n(type, props, ...args);
}
const Fragment = ({ children }) => children;
n.Fragment = Fragment;
h.Fragment = Fragment;
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
  h,
  n,
  ...require("./render"),
  ...require("./helmet")
});
