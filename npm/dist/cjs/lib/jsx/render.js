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
var render_exports = {};
__export(render_exports, {
  escapeHtml: () => escapeHtml,
  isValidElement: () => import_is_valid_element.isValidElement,
  options: () => options,
  renderToHtml: () => renderToHtml,
  renderToString: () => renderToString,
  toStyle: () => toStyle
});
module.exports = __toCommonJS(render_exports);
var import_helmet = require("./helmet");
var import_index = require("./index");
var import_is_valid_element = require("./is-valid-element");
const voidTags = Object.assign(/* @__PURE__ */ Object.create(null), {
  area: true,
  base: true,
  br: true,
  col: true,
  embed: true,
  hr: true,
  img: true,
  input: true,
  link: true,
  meta: true,
  param: true,
  source: true,
  track: true,
  wbr: true
});
const REG_HTML = /["'&<>]/;
function escapeHtml(str, force) {
  return options.precompile && !force || !REG_HTML.test(str) ? str : (() => {
    let esc = "", i = 0, l = 0, html = "";
    for (; i < str.length; i++) {
      switch (str.charCodeAt(i)) {
        case 34:
          esc = "&quot;";
          break;
        case 38:
          esc = "&amp;";
          break;
        case 39:
          esc = "&#39;";
          break;
        case 60:
          esc = "&lt;";
          break;
        case 62:
          esc = "&gt;";
          break;
        default:
          continue;
      }
      if (i !== l)
        html += str.substring(l, i);
      html += esc;
      l = i + 1;
    }
    if (i !== l)
      html += str.substring(l, i);
    return html;
  })();
}
function kebab(camelCase) {
  return camelCase.replace(/[A-Z]/g, "-$&").toLowerCase();
}
const kebabList = {
  acceptCharset: "accept-charset",
  httpEquiv: "http-equiv"
};
function withKebabCheck(key) {
  if (kebabList[key] !== void 0)
    return kebab(key);
  return key.toLowerCase();
}
const toStyle = (val) => {
  return Object.keys(val).reduce(
    (a, b) => a + kebab(b) + ":" + (typeof val[b] === "number" ? val[b] + "px" : val[b]) + ";",
    ""
  );
};
const renderToString = (elem) => {
  if (elem == null || typeof elem === "boolean")
    return "";
  if (typeof elem === "number")
    return String(elem);
  if (typeof elem === "string")
    return escapeHtml(elem);
  if (Array.isArray(elem))
    return elem.map(renderToString).join("");
  const { type, props } = elem;
  if (typeof type === "function")
    return renderToString(type(props ?? {}));
  let attributes = "";
  for (const k in props) {
    let val = props[k];
    if (val == null || val === false || k === import_index.dangerHTML || k === "children" || typeof val === "function") {
      continue;
    }
    const key = k === "className" ? "class" : withKebabCheck(k);
    if (val === true) {
      attributes += ` ${key}`;
    } else {
      if (key === "style" && typeof val === "object")
        val = toStyle(val);
      attributes += ` ${key}="${escapeHtml(String(val))}"`;
    }
  }
  if (type in voidTags) {
    return `<${type}${attributes}>`;
  }
  if (props?.[import_index.dangerHTML] != null) {
    return `<${type}${attributes}>${props[import_index.dangerHTML].__html}</${type}>`;
  }
  return `<${type}${attributes}>${renderToString(props?.["children"])}</${type}>`;
};
const options = {
  onRenderHtml: (html) => html,
  onRenderElement: renderToString
};
const toHtml = (body, { head, footer, attr }) => {
  const bodyWithFooter = body + renderToString(footer);
  return "<!DOCTYPE html>" + renderToString(
    (0, import_index.n)("html", { lang: "en", ...attr.html }, [
      (0, import_index.n)("head", {}, [
        (0, import_index.n)("meta", { charset: "utf-8" }),
        (0, import_index.n)("meta", {
          name: "viewport",
          content: "width=device-width, initial-scale=1.0"
        }),
        head
      ]),
      (0, import_index.n)("body", {
        ...attr.body,
        dangerouslySetInnerHTML: { __html: bodyWithFooter }
      })
    ])
  );
};
const renderToHtml = (elem, rev) => {
  const body = options.onRenderElement(elem, rev);
  const render = (str) => {
    return options.onRenderHtml(toHtml(str, import_helmet.Helmet.rewind()), rev);
  };
  if (body instanceof Promise)
    return body.then(render);
  return render(body);
};
renderToHtml.check = import_is_valid_element.isValidElement;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  escapeHtml,
  isValidElement,
  options,
  renderToHtml,
  renderToString,
  toStyle
});
