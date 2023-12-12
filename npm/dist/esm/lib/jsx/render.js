import { Helmet } from "./helmet.js";
import {
  dangerHTML,
  RequestEventContext
} from "./index.js";
import { isValidElement } from "./is-valid-element.js";
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
    if (val == null || val === false || k === dangerHTML || k === "children" || typeof val === "function") {
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
  const { head, footer, attr } = Helmet.rewind();
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
  if (props?.[dangerHTML] != null) {
    return `<${type}${attributes}>${props[dangerHTML].__html}</${type}>`;
  }
  return `<${type}${attributes}>${await renderToString(
    props?.["children"]
  )}</${type}>`;
}
const renderToHtml = async (elem, rev) => {
  elem = RequestEventContext({ rev, children: elem });
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
          const elem2 = RequestEventContext({
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
renderToHtml.check = isValidElement;
renderToReadableStream.check = isValidElement;
export {
  escapeHtml,
  isValidElement,
  mutateAttr,
  options,
  renderToHtml,
  renderToReadableStream,
  renderToString,
  toStyle,
  writeHtml
};
