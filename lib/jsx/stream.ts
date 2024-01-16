import { type RequestEvent } from "../deps.ts";
import { Helmet } from "./helmet.ts";
import { elemToRevContext } from "./hook.ts";
import {
  FC,
  HelmetRewind,
  type JSXElement,
  n,
  useInternalHook,
} from "./index.ts";
import {
  bodyWithHelmet,
  isValidElement,
  options,
  type RenderHTML,
  renderToString,
  toAttr,
  toInitHead,
} from "./render.ts";

const encoder = new TextEncoder();

export async function toStream(
  body: string,
  { footer, attr, head }: HelmetRewind,
  write: (data: string) => void,
  rev: RequestEvent,
  initHead?: string,
) {
  const hook = useInternalHook(rev);
  write(options.docType ?? "<!DOCTYPE html>");
  write(
    `<html${
      toAttr(attr.html)
    }><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">`,
  );
  if (initHead !== void 0) write(initHead);
  if (head.length > 0) write(await renderToString(head));
  write(`</head><body${toAttr(attr.body)}>${body}`);
  if (hook.sus.length > 0) {
    const toTemplate = async (
      { idx, elem }: { idx: number; elem: JSXElement },
    ) => {
      let child: string;
      try {
        child = await renderToString(await elemToRevContext(elem, rev));
      } catch (error) {
        let err_elem;
        if (options.onErrorStream !== void 0) {
          err_elem = await elemToRevContext(
            n(options.onErrorStream, { error }),
            rev,
          );
        } else {
          err_elem = String(error);
        }
        child = await renderToString(err_elem);
      }
      return (
        `<template id="__t__:${idx}">` + child + `</template>` +
        `<script>(function(){function $(s){return document.getElementById(s)};var t=$("__t__:${idx}");var r=$("__s__:${idx}");(r.replaceWith||r.replaceNode).bind(r)(t.content);t.remove();})();</script>`
      );
    };
    const elems = hook.sus.map(toTemplate) as Promise<string>[];
    const len = elems.length;
    if (len === 1) {
      write(await elems[0]);
    } else {
      const state = { count: 0 };
      elems.forEach((elem) => elem.then(write).finally(() => state.count++));
      while (state.count !== len) await Promise.all(elems);
    }
    write(await renderToString(Helmet.rewind().footer));
  } else if (footer.length > 0) {
    write(await renderToString(footer));
  }
  write("</body></html>");
}
/**
 * render to ReadableStream in `app.engine`.
 * @example
 * ```tsx
 * const app = nhttp();
 *
 * app.engine(renderToReadableStream);
 *
 * app.get("/", () => {
 *   return <h1>hello</h1>;
 * });
 * ```
 */
export const renderToReadableStream: RenderHTML = async (elem, rev) => {
  const initHead = toInitHead(rev.__init_head, options.initHead);
  const stream = await options.onRenderStream(
    new ReadableStream({
      async start(ctrl) {
        const enqueue = (data: string) => {
          try {
            ctrl.enqueue(encoder.encode(data));
          } catch { /* noop */ }
        };
        const writeStream = async (elem: JSXElement) => {
          const body = await options.onRenderElement(elem, rev);
          const rewind = Helmet.rewind();
          rewind.attr.html.lang ??= "en";
          if (rev.hxRequest) {
            enqueue(await bodyWithHelmet(body, rewind));
          } else {
            await toStream(
              body,
              rewind,
              enqueue,
              rev,
              initHead,
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
                rev,
              ),
            );
          } else {
            enqueue(String(error));
          }
        }
        ctrl.close();
      },
    }),
    rev,
  );
  return stream;
};
renderToReadableStream.check = isValidElement;

/**
 * Suspense for renderToReadableStream.
 * @unsupported
 * - Helmet => please use Helmet outside `Suspense`.
 * - twindStream => please use twind instead.
 * @example
 * ```tsx
 * app.engine(renderToReadableStream);
 *
 * app.get("/", () => {
 *   return (
 *     <Suspense fallback={<span>loading...</span>}>
 *       <Home/>
 *     </Suspense>
 *   )
 * })
 * ```
 */
export const Suspense: FC<
  { fallback?: JSX.Element }
> = (props) => {
  const hook = useInternalHook();
  const idx = hook.sus_id--;
  const id = `__s__:${idx}`;
  hook.sus.push({ idx, elem: props.children });
  return n("span", { id }, props.fallback) as JSXElement;
};
