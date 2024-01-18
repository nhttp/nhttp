import { Helmet } from "./helmet.js";
import {
  dangerHTML,
  elemToRevContext
} from "./index.js";
import { isValidElement } from "./is-valid-element.js";
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
const voidNonPx = Object.assign(/* @__PURE__ */ Object.create(null), {
  "animation-iteration-count": true,
  "border-image-outset": true,
  "border-image-slice": true,
  "border-image-width": true,
  "box-flex": true,
  "box-flex-group": true,
  "box-ordinal-group": true,
  "column-count": true,
  "fill-opacity": true,
  "flex": true,
  "flex-grow": true,
  "flex-negative": true,
  "flex-order": true,
  "flex-positive": true,
  "flex-shrink": true,
  "flood-opacity": true,
  "font-weight": true,
  "grid-column": true,
  "grid-row": true,
  "line-clamp": true,
  "line-height": true,
  "opacity": true,
  "order": true,
  "orphans": true,
  "stop-opacity": true,
  "stroke-dasharray": true,
  "stroke-dashoffset": true,
  "stroke-miterlimit": true,
  "stroke-opacity": true,
  "stroke-width": true,
  "tab-size": true,
  "widows": true,
  "z-index": true,
  "zoom": true
});
const KEBAB_CSS = {};
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
const toAttr = (props = {}) => {
  let attr = "";
  for (const k in props) {
    let val = props[k];
    if (val == null || val === false || k === dangerHTML || k === "children" || typeof val === "function") {
      continue;
    }
    const key = mutateAttr[k] ?? withAt(k.toLowerCase());
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
function toStyle(obj) {
  let out = "";
  for (const k in obj) {
    const val = obj[k];
    if (val != null && val !== "") {
      const name = k[0] === "-" ? k : KEBAB_CSS[k] ??= kebab(k);
      let s = ";";
      if (typeof val === "number" && !name.startsWith("--") && !(name in voidNonPx)) {
        s = "px;";
      }
      out = out + name + ":" + val + s;
    }
  }
  return out || void 0;
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
  if (props?.[dangerHTML] != null) {
    if (type === "")
      return props[dangerHTML].__html;
    return `<${type}${attributes}>${props[dangerHTML].__html}</${type}>`;
  }
  const child = await renderToString(props?.["children"]);
  if (type === "")
    return child;
  return `<${type}${attributes}>${child}</${type}>`;
}
async function bodyWithHelmet(body, { title, footer }) {
  let src = "";
  if (title !== void 0) {
    src += `<script>document.title="${escapeHtml(title)}";</script>`;
  }
  if (footer.length > 0)
    src += await renderToString(footer);
  return body + src;
}
const renderToHtml = async (elem, rev) => {
  elem = await elemToRevContext(elem, rev);
  const body = await options.onRenderElement(elem, rev);
  const rewind = Helmet.rewind();
  rewind.attr.html.lang ??= "en";
  if (rev.hxRequest)
    return await bodyWithHelmet(body, rewind);
  const html = await toHtml(
    body,
    rewind,
    toInitHead(rev.__init_head, options.initHead)
  );
  return await options.onRenderHtml(html, rev);
};
renderToHtml.check = isValidElement;
export {
  bodyWithHelmet,
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
};
