import type { RequestEvent, TRet } from "../deps.ts";
import { Helmet } from "./helmet.ts";
import {
  dangerHTML,
  FC,
  JSXElement,
  JSXNode,
  RequestEventContext,
} from "./index.ts";
import { isValidElement } from "./is-valid-element.ts";

export { isValidElement };

export const options: TOptionsRender = {
  onRenderHtml: (html) => html,
  onRenderElement: renderToString,
  onRenderStream: (stream) => stream,
};
const voidTags: Record<string, boolean> = Object.assign(Object.create(null), {
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
  wbr: true,
});
const isArray = Array.isArray;
export const mutateAttr: Record<string, string> = {
  acceptCharset: "accept-charset",
  httpEquiv: "http-equiv",
  htmlFor: "for",
  className: "class",
};
const toAttr = (props: TRet) => {
  let attr = "";
  for (const k in props) {
    let val = props[k];
    if (
      val == null ||
      val === false ||
      k === dangerHTML ||
      k === "children" ||
      typeof val === "function"
    ) {
      continue;
    }
    const key = mutateAttr[k] ?? k.toLowerCase();
    if (val === true) {
      attr += ` ${key}`;
    } else {
      if (key === "style" && typeof val === "object") val = toStyle(val);
      attr += ` ${key}="${escapeHtml(String(val))}"`;
    }
  }
  return attr;
};
export async function writeHtml(body: string, write: (data: string) => void) {
  const { head, footer, attr } = Helmet.rewind();
  const writeElem = async (elem: JSX.Element[]) => {
    for (let i = 0; i < elem.length; i++) {
      write(await renderToString(elem[i]));
    }
  };
  write(options.docType ?? "<!DOCTYPE html>");
  write(`<html${toAttr({ lang: "en", ...attr.html })}>`);
  write("<head>");
  write(`<meta charset="utf-8">`);
  write(
    `<meta name="viewport" content="width=device-width, initial-scale=1.0">`,
  );
  await writeElem(head);
  write("</head>");
  write(`<body${toAttr(attr.body)}>`);
  write(body);
  await writeElem(footer);
  write("</body>");
  write("</html>");
}

export type TOptionsRender = {
  /**
   * Attach on render element.
   * @example
   * options.onRenderElement = (elem, rev) => {
   *   const str = renderToString(elem);
   *   return str;
   * }
   */
  onRenderElement: (
    elem: JSX.Element,
    rev: RequestEvent,
  ) => string | Promise<string>;
  /**
   * Attach on render html.
   * @example
   * options.onRenderHtml = (html, rev) => {
   *   // code here
   *   return html;
   * }
   */
  onRenderHtml: (html: string, rev: RequestEvent) => string | Promise<string>;
  /**
   * Attach on render stream.
   * @example
   * options.onRenderStream = (stream, rev) => {
   *   // code here
   *   return stream;
   * }
   */
  onRenderStream: (
    stream: ReadableStream,
    rev: RequestEvent,
  ) => ReadableStream | Promise<ReadableStream>;
  /**
   * jsx transform precompile.
   */
  precompile?: boolean;
  /**
   * custom error on stream.
   * @example
   * ```tsx
   * options.onErrorStream = (props) => {
   *  return <h1>{props.error.message}</h1>
   * }
   * ```
   */
  onErrorStream?: FC<{ error: Error }>;
  /**
   * custom doc type.
   */
  docType?: string;
};
export type RenderHTML = ((...args: TRet) => TRet) & {
  check: (elem: TRet) => boolean;
};
const REG_HTML = /["'&<>]/;
export function escapeHtml(str: string, force?: boolean) {
  // optimize
  return (options.precompile && !force) || !REG_HTML.test(str) ? str : (() => {
    let esc = "", i = 0, l = 0, html = "";
    for (; i < str.length; i++) {
      switch (str.charCodeAt(i)) {
        case 34: // "
          esc = "&quot;";
          break;
        case 38: // &
          esc = "&amp;";
          break;
        case 39: // '
          esc = "&#39;";
          break;
        case 60: // <
          esc = "&lt;";
          break;
        case 62: // >
          esc = "&gt;";
          break;
        default:
          continue;
      }
      if (i !== l) html += str.substring(l, i);
      html += esc;
      l = i + 1;
    }
    if (i !== l) html += str.substring(l, i);
    return html;
  })();
}
function kebab(camelCase: string) {
  return camelCase.replace(/[A-Z]/g, "-$&").toLowerCase();
}

export const toStyle = (val: Record<string, string | number>) => {
  return Object.keys(val).reduce(
    (a, b) =>
      a +
      kebab(b) +
      ":" +
      (typeof val[b] === "number" ? val[b] + "px" : val[b]) +
      ";",
    "",
  );
};

/**
 * renderToString.
 * @example
 * const str = await renderToString(<App />);
 */
export async function renderToString(elem: JSXNode<TRet>): Promise<string> {
  if (elem instanceof Promise) return renderToString(await elem);
  if (elem == null || typeof elem === "boolean") return "";
  if (typeof elem === "number") return String(elem);
  if (typeof elem === "string") return escapeHtml(elem);
  if (isArray(elem)) {
    return (await Promise.all(elem.map(renderToString))).join("");
  }
  const { type, props } = elem as JSXElement<TRet>;
  if (typeof type === "function") {
    return renderToString(await type(props ?? {}));
  }
  const attributes = toAttr(props);
  if (type in voidTags) return `<${type}${attributes}>`;
  if (props?.[dangerHTML] != null) {
    return `<${type}${attributes}>${props[dangerHTML].__html}</${type}>`;
  }
  return `<${type}${attributes}>${await renderToString(
    props?.["children"],
  )}</${type}>`;
}

/**
 * render to html in `app.engine`.
 * @example
 * ```tsx
 * const app = nhttp();
 *
 * app.engine(renderToHtml);
 *
 * app.get("/", () => {
 *   return <h1>hello</h1>;
 * });
 * ```
 */
export const renderToHtml: RenderHTML = async (elem, rev) => {
  elem = RequestEventContext({ rev, children: elem });
  const body = await options.onRenderElement(elem, rev);
  let html = "";
  await writeHtml(body, (s: string) => (html += s));
  return options.onRenderHtml(html, rev);
};
const encoder = new TextEncoder();
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
export const renderToReadableStream: RenderHTML = (elem, rev) => {
  return options.onRenderStream(
    new ReadableStream({
      async start(ctrl) {
        const writeStream = async (child: JSXElement) => {
          const elem = RequestEventContext({
            rev,
            children: child,
          }) as JSXElement;
          const body = await options.onRenderElement(elem, rev);
          await writeHtml(
            body,
            (str: string) => ctrl.enqueue(encoder.encode(str)),
          );
        };
        try {
          await writeStream(elem);
        } catch (error) {
          if (options.onErrorStream) {
            await writeStream(
              await options.onErrorStream({ error }) as JSXElement,
            );
          } else {
            ctrl.enqueue(encoder.encode(error));
          }
        }
        ctrl.close();
      },
    }),
    rev,
  );
};

renderToHtml.check = isValidElement;
renderToReadableStream.check = isValidElement;
