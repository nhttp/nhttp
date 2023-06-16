import { Helmet as HelmetOri } from "./helmet.js";
import {
  isValidElement as isValidElementOri,
  renderToHtml as renderToHtmlOri,
  renderToString as renderToStringOri
} from "./render.js";
const dangerHTML = "dangerouslySetInnerHTML";
const emreg = /area|base|br|col|embed|hr|img|input|keygen|link|meta|param|source|track|wbr/;
const Helmet = HelmetOri;
const renderToHtml = renderToHtmlOri;
const renderToString = renderToStringOri;
const isValidElement = isValidElementOri;
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
export {
  Fragment,
  Helmet,
  h,
  isValidElement,
  n,
  renderToHtml,
  renderToString
};
