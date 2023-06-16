var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = /* @__PURE__ */ ((cache) => {
  return (module2, temp) => {
    return cache && cache.get(module2) || (temp = __reExport(__markAsModule({}), module2, 1), cache && cache.set(module2, temp), temp);
  };
})(typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : 0);
var jsx_exports = {};
__export(jsx_exports, {
  Fragment: () => Fragment,
  Helmet: () => Helmet,
  h: () => h,
  isValidElement: () => isValidElement,
  n: () => n,
  renderToHtml: () => renderToHtml,
  renderToString: () => renderToString
});
var import_helmet = require("./helmet");
var import_render = require("./render");
const dangerHTML = "dangerouslySetInnerHTML";
const emreg = /area|base|br|col|embed|hr|img|input|keygen|link|meta|param|source|track|wbr/;
const Helmet = import_helmet.Helmet;
const renderToHtml = import_render.renderToHtml;
const renderToString = import_render.renderToString;
const isValidElement = import_render.isValidElement;
function escapeHtml(unsafe) {
  return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function n(type, props, ...args) {
  props ??= { children: "" };
  if (!type)
    return "";
  const children = args.map((el) => {
    return typeof el === "number" ? String(el) : el;
  }).filter(Boolean);
  if (typeof type === "function") {
    props.children = children.join("");
    return type(props);
  }
  let str = `<${type}`;
  for (let k in props) {
    const val = props[k];
    if (val !== void 0 && val !== null && k !== dangerHTML && k !== "children") {
      if (typeof k === "string") {
        k = k.toLowerCase();
        if (k === "classname")
          k = "class";
      }
      const type2 = typeof val;
      if (type2 === "boolean" || type2 === "object" || type2 === "function") {
        if (type2 === "object") {
          str += ` ${k}="${Object.keys(val).reduce((a, b) => a + b.split(/(?=[A-Z])/).join("-").toLowerCase() + ":" + (typeof val[b] === "number" ? val[b] + "px" : val[b]) + ";", "")}"`;
        } else if (val === true)
          str += ` ${k}`;
        else if (val === false)
          str += "";
      } else
        str += ` ${k}="${escapeHtml(val.toString())}"`;
    }
  }
  str += ">";
  if (emreg.test(type))
    return str;
  if (props[dangerHTML]) {
    str += props[dangerHTML].__html;
  } else {
    children.forEach((child) => {
      if (typeof child === "string")
        str += child;
      else if (Array.isArray(child))
        str += child.join("");
    });
  }
  return str += type ? `</${type}>` : "";
}
function h(type, props, ...args) {
  return n(type, props, ...args);
}
const Fragment = ({ children }) => children;
n.Fragment = Fragment;
h.Fragment = Fragment;
module.exports = __toCommonJS(jsx_exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Fragment,
  Helmet,
  h,
  isValidElement,
  n,
  renderToHtml,
  renderToString
});
