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
  bodyWithTitle: () => bodyWithTitle,
  escapeHtml: () => escapeHtml,
  internal: () => internal,
  isValidElement: () => import_is_valid_element.isValidElement,
  mutateAttr: () => mutateAttr,
  options: () => options,
  renderToHtml: () => renderToHtml,
  renderToString: () => renderToString,
  toAttr: () => toAttr,
  toHtml: () => toHtml,
  toInitHead: () => toInitHead,
  toStyle: () => toStyle
});
module.exports = __toCommonJS(render_exports);
var import_helmet = require("./helmet");
var import_index = require("./index");
var import_is_valid_element = require("./is-valid-element");
const internal = {};
const options = {
  onRenderHtml: (html) => html,
  onRenderElement: renderToString,
  onRenderStream: (stream) => stream,
  requestEventContext: true
};
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
const isArray = Array.isArray;
function toInitHead(a, b) {
  if (a !== void 0 && b !== void 0)
    return b + a;
  return a || b;
}
const mutateAttr = {
  acceptCharset: "accept-charset",
  httpEquiv: "http-equiv",
  htmlFor: "for",
  className: "class"
};
function withAt(k) {
  return k.startsWith("at-") ? "@" + k.slice(3) : k;
}
function mutateProps(props = {}) {
  const obj = {};
  for (const k in props) {
    const val = props[k];
    if (val == null || val === false || k === import_index.dangerHTML || k === "children" || typeof val === "function") {
      continue;
    }
    const key = mutateAttr[k] ?? withAt(k.toLowerCase());
    obj[key] = val;
  }
  return obj;
}
const toAttr = (p = {}) => {
  const props = mutateProps(p);
  let attr = "";
  for (const key in props) {
    let val = props[key];
    if (val === true) {
      attr += ` ${key}`;
    } else {
      if (key === "style" && typeof val === "object")
        val = toStyle(val);
      attr += ` ${key}="${escapeHtml(String(val))}"`;
    }
  }
  return attr;
};
const toHtml = async (body, { head, footer, attr }, initHead = "") => {
  return (options.docType ?? "<!DOCTYPE html>") + `<html${toAttr(attr.html)}><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">` + initHead + (head.length > 0 ? await renderToString(head) : "") + `</head><body${toAttr(attr.body)}>${body}` + (footer.length > 0 ? await renderToString(footer) : "") + "</body></html>";
};
const REG_HTML = /["'&<>]/;
function escapeHtml(str, force) {
  return internal.precompile && !force || !REG_HTML.test(str) ? str : (() => {
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
function toStyle(val) {
  return Object.keys(val).reduce(
    (a, b) => a + kebab(b) + ":" + (typeof val[b] === "number" ? val[b] + "px" : val[b]) + ";",
    ""
  );
}
async function renderToString(elem) {
  if (elem == null || typeof elem === "boolean")
    return "";
  if (typeof elem === "number")
    return String(elem);
  if (typeof elem === "string")
    return escapeHtml(elem);
  if (isArray(elem)) {
    let str = "", i = 0;
    const len = elem.length;
    while (i < len) {
      str += await renderToString(elem[i]);
      i++;
    }
    return str;
  }
  const { type, props } = elem;
  if (typeof type === "function") {
    return await renderToString(await type(props ?? {}));
  }
  const attributes = toAttr(props);
  if (type in voidTags)
    return `<${type}${attributes}>`;
  if (props?.[import_index.dangerHTML] != null) {
    if (type === "")
      return props[import_index.dangerHTML].__html;
    return `<${type}${attributes}>${props[import_index.dangerHTML].__html}</${type}>`;
  }
  const child = await renderToString(props?.["children"]);
  if (type === "")
    return child;
  return `<${type}${attributes}>${child}</${type}>`;
}
function bodyWithTitle(body, title) {
  if (title !== void 0) {
    return `${body}<script>document.title="${escapeHtml(title)}";</script>`;
  }
  return body;
}
const renderToHtml = async (elem, rev) => {
  elem = await (0, import_index.elemToRevContext)(elem, rev);
  const body = await options.onRenderElement(elem, rev);
  const rewind = import_helmet.Helmet.rewind();
  rewind.attr.html.lang ??= "en";
  if (rev.hxRequest)
    return bodyWithTitle(body, rewind.title);
  const html = await toHtml(
    body,
    rewind,
    toInitHead(rev.__init_head, options.initHead)
  );
  return await options.onRenderHtml(html, rev);
};
renderToHtml.check = import_is_valid_element.isValidElement;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  bodyWithTitle,
  escapeHtml,
  internal,
  isValidElement,
  mutateAttr,
  options,
  renderToHtml,
  renderToString,
  toAttr,
  toHtml,
  toInitHead,
  toStyle
});
