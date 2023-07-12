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
  h: () => h,
  isValidElement: () => import_is_valid_element.isValidElement,
  n: () => n
});
var import_is_valid_element = require("./is-valid-element");
const dangerHTML = "dangerouslySetInnerHTML";
const isValue = (val) => val != null;
function escapeHtml(unsafe) {
  return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
const toStyle = (val) => {
  return Object.keys(val).reduce((a, b) => a + b.split(/(?=[A-Z])/).join("-").toLowerCase() + ":" + (typeof val[b] === "number" ? val[b] + "px" : val[b]) + ";", "");
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
module.exports = __toCommonJS(jsx_exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Fragment,
  h,
  isValidElement,
  n
});
