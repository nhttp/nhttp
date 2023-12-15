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
  Suspense: () => Suspense,
  escapeHtml: () => escapeHtml,
  isValidElement: () => import_is_valid_element.isValidElement,
  mutateAttr: () => mutateAttr,
  options: () => options,
  renderToHtml: () => renderToHtml,
  renderToReadableStream: () => renderToReadableStream,
  renderToString: () => renderToString,
  toStyle: () => toStyle,
  writeHtml: () => writeHtml
});
module.exports = __toCommonJS(render_exports);
var import_helmet = require("./helmet");
var import_index = require("./index");
var import_is_valid_element = require("./is-valid-element");
const sus = {
  i: 0,
  arr: []
};
const options = {
  onRenderHtml: (html) => html,
  onRenderElement: renderToString,
  onRenderStream: (stream) => stream,
  useHook: true
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
const mutateAttr = {
  acceptCharset: "accept-charset",
  httpEquiv: "http-equiv",
  htmlFor: "for",
  className: "class"
};
const toAttr = (props = {}) => {
  let attr = "";
  for (const k in props) {
    let val = props[k];
    if (val == null || val === false || k === import_index.dangerHTML || k === "children" || typeof val === "function") {
      continue;
    }
    const key = mutateAttr[k] ?? k.toLowerCase();
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
async function writeHtml(body, write) {
  const { footer, attr, head } = import_helmet.Helmet.rewind();
  write(options.docType ?? "<!DOCTYPE html>");
  write(
    `<html${toAttr({ lang: "en", ...attr.html })}><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">`
  );
  if (head.length > 0)
    write(await renderToString(head));
  write(`</head><body${toAttr(attr.body)}>${body}`);
  if (sus.i > 0) {
    for (let i = 0; i < sus.i; i++) {
      const elem = sus.arr[i];
      write(`<template id="__t__:${i}">`);
      write(await renderToString(elem));
      write(`</template>`);
      write(
        `<script>(function(){function $(s){return document.getElementById(s)};var t=$("__t__:${i}");var r=$("__s__:${i}");(r.replaceWith||r.replaceNode).bind(r)(t.content);t.remove();})();</script>`
      );
    }
    write(await renderToString(import_helmet.Helmet.rewind().footer));
    sus.i = 0;
    sus.arr = [];
  } else if (footer.length > 0) {
    write(await renderToString(footer));
  }
  write("</body></html>");
}
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
    return `<${type}${attributes}>${props[import_index.dangerHTML].__html}</${type}>`;
  }
  return `<${type}${attributes}>${await renderToString(
    props?.["children"]
  )}</${type}>`;
}
const renderToHtml = async (elem, rev) => {
  if (options.useHook) {
    elem = (0, import_index.RequestEventContext)({ rev, children: elem });
  }
  const body = await options.onRenderElement(elem, rev);
  let html = "";
  await writeHtml(body, (s) => html += s);
  return await options.onRenderHtml(html, rev);
};
const encoder = new TextEncoder();
const renderToReadableStream = async (elem, rev) => {
  const stream = await options.onRenderStream(
    new ReadableStream({
      async start(ctrl) {
        const writeStream = async (child) => {
          const elem2 = options.useHook ? (0, import_index.RequestEventContext)({
            rev,
            children: child
          }) : child;
          const body = await options.onRenderElement(elem2, rev);
          await writeHtml(
            body,
            (str) => ctrl.enqueue(encoder.encode(str))
          );
        };
        try {
          await writeStream(elem);
        } catch (error) {
          if (options.onErrorStream) {
            await writeStream(
              await options.onErrorStream({ error })
            );
          } else {
            ctrl.enqueue(encoder.encode(error));
          }
        }
        ctrl.close();
      }
    }),
    rev
  );
  return stream;
};
renderToHtml.check = import_is_valid_element.isValidElement;
renderToReadableStream.check = import_is_valid_element.isValidElement;
const Suspense = (props) => {
  const i = sus.i;
  const id = `__s__:${i}`;
  sus.arr[i] = props.children;
  sus.i++;
  return (0, import_index.n)(
    "div",
    { id },
    typeof props.fallback === "function" ? props.fallback({}) : props.fallback
  );
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Suspense,
  escapeHtml,
  isValidElement,
  mutateAttr,
  options,
  renderToHtml,
  renderToReadableStream,
  renderToString,
  toStyle,
  writeHtml
});
