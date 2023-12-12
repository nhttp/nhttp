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
const options = {
  onRenderHtml: (html) => html,
  onRenderElement: renderToString,
  onRenderStream: (stream) => stream
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
const toAttr = (props) => {
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
  const { head, footer, attr } = import_helmet.Helmet.rewind();
  const writeElem = async (elem) => {
    for (let i = 0; i < elem.length; i++) {
      write(await renderToString(elem[i]));
    }
  };
  write(options.docType ?? "<!DOCTYPE html>");
  write(`<html${toAttr({ lang: "en", ...attr.html })}>`);
  write("<head>");
  write(`<meta charset="utf-8">`);
  write(
    `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
  );
  await writeElem(head);
  write("</head>");
  write(`<body${toAttr(attr.body)}>`);
  write(body);
  await writeElem(footer);
  write("</body>");
  write("</html>");
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
const toStyle = (val) => {
  return Object.keys(val).reduce(
    (a, b) => a + kebab(b) + ":" + (typeof val[b] === "number" ? val[b] + "px" : val[b]) + ";",
    ""
  );
};
async function renderToString(elem) {
  if (elem instanceof Promise)
    return renderToString(await elem);
  if (elem == null || typeof elem === "boolean")
    return "";
  if (typeof elem === "number")
    return String(elem);
  if (typeof elem === "string")
    return escapeHtml(elem);
  if (isArray(elem)) {
    return (await Promise.all(elem.map(renderToString))).join("");
  }
  const { type, props } = elem;
  if (typeof type === "function") {
    return renderToString(await type(props ?? {}));
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
  elem = (0, import_index.RequestEventContext)({ rev, children: elem });
  const body = await options.onRenderElement(elem, rev);
  let html = "";
  await writeHtml(body, (s) => html += s);
  return options.onRenderHtml(html, rev);
};
const encoder = new TextEncoder();
const renderToReadableStream = (elem, rev) => {
  return options.onRenderStream(
    new ReadableStream({
      async start(ctrl) {
        const writeStream = async (child) => {
          const elem2 = (0, import_index.RequestEventContext)({
            rev,
            children: child
          });
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
};
renderToHtml.check = import_is_valid_element.isValidElement;
renderToReadableStream.check = import_is_valid_element.isValidElement;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
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
