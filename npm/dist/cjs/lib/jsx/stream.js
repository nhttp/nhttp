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
var stream_exports = {};
__export(stream_exports, {
  Suspense: () => Suspense,
  renderToReadableStream: () => renderToReadableStream,
  toStream: () => toStream
});
module.exports = __toCommonJS(stream_exports);
var import_helmet = require("./helmet");
var import_hook = require("./hook");
var import_index = require("./index");
var import_render = require("./render");
const encoder = new TextEncoder();
async function toStream(body, write, rev, initHead) {
  const hook = (0, import_index.useInternalHook)(rev);
  const { footer, attr, head } = import_helmet.Helmet.rewind();
  attr.html.lang ??= "en";
  write(import_render.options.docType ?? "<!DOCTYPE html>");
  write(
    `<html${(0, import_render.toAttr)(attr.html)}><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">`
  );
  if (initHead !== void 0)
    write(initHead);
  if (head.length > 0)
    write(await (0, import_render.renderToString)(head));
  write(`</head><body${(0, import_render.toAttr)(attr.body)}>${body}`);
  if (hook.sus.length > 0) {
    const toTemplate = async ({ idx, elem }) => {
      let child;
      try {
        child = await (0, import_render.renderToString)(await (0, import_hook.elemToRevContext)(elem, rev));
      } catch (error) {
        let err_elem;
        if (import_render.options.onErrorStream !== void 0) {
          err_elem = await (0, import_hook.elemToRevContext)(
            (0, import_index.n)(import_render.options.onErrorStream, { error }),
            rev
          );
        } else {
          err_elem = String(error);
        }
        child = await (0, import_render.renderToString)(err_elem);
      }
      return `<template id="__t__:${idx}">` + child + `</template><script>(function(){function $(s){return document.getElementById(s)};var t=$("__t__:${idx}");var r=$("__s__:${idx}");(r.replaceWith||r.replaceNode).bind(r)(t.content);t.remove();})();</script>`;
    };
    const elems = hook.sus.map(toTemplate);
    const len = elems.length;
    if (len === 1) {
      write(await elems[0]);
    } else {
      const state = { count: 0 };
      elems.forEach((elem) => elem.then(write).finally(() => state.count++));
      while (state.count !== len)
        await Promise.all(elems);
    }
    write(await (0, import_render.renderToString)(import_helmet.Helmet.rewind().footer));
  } else if (footer.length > 0) {
    write(await (0, import_render.renderToString)(footer));
  }
  write("</body></html>");
}
const renderToReadableStream = async (elem, rev) => {
  const initHead = (0, import_render.toInitHead)(rev.__init_head, import_render.options.initHead);
  const stream = await import_render.options.onRenderStream(
    new ReadableStream({
      async start(ctrl) {
        const enqueue = (data) => {
          try {
            ctrl.enqueue(encoder.encode(data));
          } catch {
          }
        };
        const writeStream = async (elem2) => {
          const body = await import_render.options.onRenderElement(elem2, rev);
          if (rev.isHtmx) {
            const client = (0, import_render.helmetToClient)(import_helmet.Helmet.rewind());
            enqueue(
              `${body}${client !== void 0 ? `<script>${client}</script>` : ""}`
            );
          } else {
            await toStream(
              body,
              (str) => enqueue(str),
              rev,
              initHead
            );
          }
        };
        try {
          await writeStream(await (0, import_hook.elemToRevContext)(elem, rev));
        } catch (error) {
          if (import_render.options.onErrorStream) {
            await writeStream(
              await (0, import_hook.elemToRevContext)(
                (0, import_index.n)(import_render.options.onErrorStream, { error }),
                rev
              )
            );
          } else {
            enqueue(String(error));
          }
        }
        ctrl.close();
      }
    }),
    rev
  );
  return stream;
};
renderToReadableStream.check = import_render.isValidElement;
const Suspense = (props) => {
  const hook = (0, import_index.useInternalHook)();
  const idx = hook.sus_id--;
  const id = `__s__:${idx}`;
  hook.sus.push({ idx, elem: props.children });
  return (0, import_index.n)("span", { id }, props.fallback);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Suspense,
  renderToReadableStream,
  toStream
});
