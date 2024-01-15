import { Helmet } from "./helmet.js";
import { elemToRevContext } from "./hook.js";
import {
  n,
  useInternalHook
} from "./index.js";
import {
  bodyWithTitle,
  isValidElement,
  options,
  renderToString,
  toAttr,
  toInitHead
} from "./render.js";
const encoder = new TextEncoder();
async function toStream(body, { footer, attr, head }, write, rev, initHead) {
  const hook = useInternalHook(rev);
  write(options.docType ?? "<!DOCTYPE html>");
  write(
    `<html${toAttr(attr.html)}><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">`
  );
  if (initHead !== void 0)
    write(initHead);
  if (head.length > 0)
    write(await renderToString(head));
  write(`</head><body${toAttr(attr.body)}>${body}`);
  if (hook.sus.length > 0) {
    const toTemplate = async ({ idx, elem }) => {
      let child;
      try {
        child = await renderToString(await elemToRevContext(elem, rev));
      } catch (error) {
        let err_elem;
        if (options.onErrorStream !== void 0) {
          err_elem = await elemToRevContext(
            n(options.onErrorStream, { error }),
            rev
          );
        } else {
          err_elem = String(error);
        }
        child = await renderToString(err_elem);
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
    write(await renderToString(Helmet.rewind().footer));
  } else if (footer.length > 0) {
    write(await renderToString(footer));
  }
  write("</body></html>");
}
const renderToReadableStream = async (elem, rev) => {
  const initHead = toInitHead(rev.__init_head, options.initHead);
  const stream = await options.onRenderStream(
    new ReadableStream({
      async start(ctrl) {
        const enqueue = (data) => {
          try {
            ctrl.enqueue(encoder.encode(data));
          } catch {
          }
        };
        const rewind = Helmet.rewind();
        rewind.attr.html.lang ??= "en";
        const writeStream = async (elem2) => {
          const body = await options.onRenderElement(elem2, rev);
          if (rev.hxRequest) {
            enqueue(bodyWithTitle(body, rewind.title));
          } else {
            await toStream(
              body,
              rewind,
              enqueue,
              rev,
              initHead
            );
          }
        };
        try {
          await writeStream(await elemToRevContext(elem, rev));
        } catch (error) {
          if (options.onErrorStream) {
            await writeStream(
              await elemToRevContext(
                n(options.onErrorStream, { error }),
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
renderToReadableStream.check = isValidElement;
const Suspense = (props) => {
  const hook = useInternalHook();
  const idx = hook.sus_id--;
  const id = `__s__:${idx}`;
  hook.sus.push({ idx, elem: props.children });
  return n("span", { id }, props.fallback);
};
export {
  Suspense,
  renderToReadableStream,
  toStream
};
