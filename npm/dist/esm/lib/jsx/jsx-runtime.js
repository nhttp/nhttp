import {
  escapeHtml,
  Fragment,
  n,
  options,
  renderToString,
  toStyle
} from "./index.js";
const isArray = Array.isArray;
const createElement = (type, props) => {
  if (props?.children == null)
    return n(type, props);
  const childs = props.children;
  delete props.children;
  if (isArray(childs))
    return n(type, props, ...childs);
  return n(type, props, childs);
};
const jsxTemplate = async (tpl, ...subs) => {
  options.precompile ??= true;
  let str = "";
  for (let i = 0; i < tpl.length; i++) {
    str += await renderToString(tpl[i]);
    if (i < subs.length) {
      str += await renderToString(subs[i]);
    }
  }
  return str;
};
const jsxEscape = (v) => {
  return v == null || typeof v === "boolean" || typeof v === "function" ? null : v;
};
const jsxAttr = (k, v) => {
  if (k === "style" && typeof v === "object") {
    return `${k}="${toStyle(v)}"`;
  }
  if (v == null || v === false || typeof v === "function" || typeof v === "object") {
    return "";
  } else if (v === true)
    return k;
  return `${k}="${escapeHtml(v, true)}"`;
};
export {
  Fragment,
  createElement as jsx,
  jsxAttr,
  createElement as jsxDEV,
  createElement as jsxDev,
  jsxEscape,
  jsxTemplate,
  createElement as jsxs
};
