import { Helmet, HELMET_FLAG } from "./helmet.js";
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
    if (val == null || val === false || k === dangerHTML || k === "children" || typeof val === "function") {
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
const toHtml = async (body, initHead = "") => {
  const { head, footer, attr } = Helmet.rewind();
  attr.html.lang ??= "en";
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
function helmetToClient({ head, footer }) {
  let has, head_src = "", body_src = "";
  const toAttr2 = (props = {}, name) => {
    let str = "";
    for (const k in props) {
      let v = props[k];
      if (v === true) {
        str += `${name}.setAttribute("${k}", "");`;
      } else {
        if (k === "style" && typeof v === "object")
          v = toStyle(v);
        str += `${name}.setAttribute("${k}", "${escapeHtml(String(v))}");`;
      }
    }
    return str;
  };
  const pushScript = (elems, name) => {
    let src = "var d=document;function $(s){return d.querySelector(s)};";
    has ??= true;
    src += `function c(n){return d.createElement(n)};`;
    if (name === "head") {
      elems = elems.filter((el) => el.type !== "meta");
      src += `var t=$("title");if(t)d.head.removeChild(t);`;
    }
    src += `d.${name}.childNodes.forEach(function(c){if(c.hasAttribute&&c.hasAttribute("${HELMET_FLAG}")){d.${name}.removeChild(c)}});`;
    elems.forEach((elem, i) => {
      const child = elem.props?.children?.[0];
      const props = mutateProps(elem.props);
      src += `var $${i}=c("${elem.type}");`;
      if (child) {
        src += `$${i}.append("${child}");`;
      }
      src += toAttr2(props, `$${i}`);
      src += `d.${name}.appendChild($${i});`;
    });
    return `(function(){${src}})();`;
  };
  if (head.length > 0)
    head_src = pushScript(head, "head");
  if (footer.length > 0)
    body_src = pushScript(footer, "body");
  return has ? head_src + body_src : void 0;
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
const renderToHtml = async (elem, rev) => {
  elem = await elemToRevContext(elem, rev);
  const body = await options.onRenderElement(elem, rev);
  if (rev.isHtmx) {
    const client = helmetToClient(Helmet.rewind());
    return `${body}${client !== void 0 ? `<script>${client}</script>` : ""}`;
  }
  const html = await toHtml(
    body,
    toInitHead(rev.__init_head, options.initHead)
  );
  return await options.onRenderHtml(html, rev);
};
renderToHtml.check = isValidElement;
export {
  escapeHtml,
  helmetToClient,
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
