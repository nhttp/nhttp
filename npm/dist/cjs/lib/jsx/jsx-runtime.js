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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var jsx_runtime_exports = {};
__export(jsx_runtime_exports, {
  Fragment: () => import_index.Fragment,
  jsx: () => createElement,
  jsxAttr: () => jsxAttr,
  jsxDEV: () => createElement,
  jsxDev: () => createElement,
  jsxEscape: () => jsxEscape,
  jsxTemplate: () => jsxTemplate,
  jsxs: () => createElement
});
module.exports = __toCommonJS(jsx_runtime_exports);
var import_index = require("./index");
const isArray = Array.isArray;
const createElement = (type, props) => {
  if (props?.children == null)
    return (0, import_index.n)(type, props);
  const childs = props.children;
  delete props.children;
  if (isArray(childs))
    return (0, import_index.n)(type, props, ...childs);
  return (0, import_index.n)(type, props, childs);
};
const jsxTemplate = (tpl, ...subs) => {
  import_index.options.precompile ??= true;
  const ret = [];
  for (let i = 0; i < tpl.length; i++) {
    ret.push(tpl[i]);
    if (i < subs.length)
      ret.push(subs[i]);
  }
  return (0, import_index.n)(import_index.Fragment, {}, ret);
};
const jsxEscape = (v) => {
  return v == null || typeof v === "boolean" || typeof v === "function" ? null : v;
};
const jsxAttr = (k, v) => {
  if (k === "style" && typeof v === "object") {
    return `${k}="${(0, import_index.toStyle)(v)}"`;
  }
  if (v == null || v === false || typeof v === "function" || typeof v === "object") {
    return "";
  } else if (v === true)
    return k;
  return `${k}="${(0, import_index.escapeHtml)(v, true)}"`;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Fragment,
  jsx,
  jsxAttr,
  jsxDEV,
  jsxDev,
  jsxEscape,
  jsxTemplate,
  jsxs
});
