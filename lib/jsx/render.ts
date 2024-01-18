import type { RequestEvent, TObject, TRet } from "../deps.ts";
import { Helmet } from "./helmet.ts";
import {
  dangerHTML,
  elemToRevContext,
  FC,
  HelmetRewind,
  JSXNode,
  type NJSX,
} from "./index.ts";
import { isValidElement } from "./is-valid-element.ts";

export { isValidElement };
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
  /**
   * use context requestEvent. default to `true`.
   */
  requestEventContext: boolean;
  initHead?: string;
};
export const internal = {} as TObject;
export const options: TOptionsRender = {
  onRenderHtml: (html) => html,
  onRenderElement: renderToString,
  onRenderStream: (stream) => stream,
  requestEventContext: true,
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
const voidNonPx: Record<string, boolean> = Object.assign(Object.create(null), {
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
  "zoom": true,
});
const KEBAB_CSS = {} as TObject;
const isArray = Array.isArray;
export function toInitHead(a: string | undefined, b: string | undefined) {
  if (a !== void 0 && b !== void 0) return b + a;
  return a || b;
}
export const mutateAttr: Record<string, string> = {
  acceptCharset: "accept-charset",
  httpEquiv: "http-equiv",
  htmlFor: "for",
  className: "class",
};
// handle alpine/vue e.g. at-click to @click
function withAt(k: string) {
  return k.startsWith("at-") ? "@" + k.slice(3) : k;
}
export const toAttr = (props: TRet = {}) => {
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
    const key = mutateAttr[k] ?? withAt(k.toLowerCase());
    if (val === true) {
      attr += ` ${key}`;
    } else {
      if (key === "style" && typeof val === "object") val = toStyle(val);
      attr += ` ${key}="${escapeHtml(String(val))}"`;
    }
  }
  return attr;
};
export const toHtml = async (
  body: string,
  { head, footer, attr }: HelmetRewind,
  initHead = "",
) => {
  return (
    (options.docType ?? "<!DOCTYPE html>") +
    `<html${toAttr(attr.html)}>` +
    '<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">' +
    initHead + (head.length > 0 ? (await renderToString(head)) : "") +
    `</head><body${toAttr(attr.body)}>${body}` +
    (footer.length > 0 ? (await renderToString(footer)) : "") +
    "</body></html>"
  );
};

export type RenderHTML = ((...args: TRet) => TRet) & {
  check: (elem: TRet) => boolean;
};
const REG_HTML = /["'&<>]/;
export function escapeHtml(str: string, force?: boolean) {
  // optimize
  return (internal.precompile && !force) || !REG_HTML.test(str) ? str : (() => {
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

export function toStyle(obj: NJSX.CSSProperties) {
  let out = "";
  for (const k in obj) {
    const val = obj[k];
    if (val != null && val !== "") {
      const name = k[0] === "-" ? k : (KEBAB_CSS[k] ??= kebab(k));
      let s = ";";
      if (
        typeof val === "number" &&
        !name.startsWith("--") &&
        !(name in voidNonPx)
      ) {
        s = "px;";
      }
      out = out + name + ":" + val + s;
    }
  }
  return out || void 0;
}
/**
 * renderToString.
 * @example
 * const str = await renderToString(<App />);
 */
export async function renderToString(elem: JSXNode<TRet>): Promise<string>;
export async function renderToString(elem: TRet): Promise<string> {
  if (elem == null || typeof elem === "boolean") return "";
  if (typeof elem === "number") return String(elem);
  if (typeof elem === "string") return escapeHtml(elem);
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
  if (type in voidTags) return `<${type}${attributes}>`;
  if (props?.[dangerHTML] != null) {
    if (type === "") return props[dangerHTML].__html;
    return `<${type}${attributes}>${props[dangerHTML].__html}</${type}>`;
  }
  const child = await renderToString(props?.["children"]);
  if (type === "") return child;
  return `<${type}${attributes}>${child}</${type}>`;
}
export async function bodyWithHelmet(
  body: string,
  { title, footer }: HelmetRewind,
) {
  let src = "";
  if (title !== void 0) {
    src += `<script>document.title="${escapeHtml(title)}";</script>`;
  }
  if (footer.length > 0) src += await renderToString(footer);
  return body + src;
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
  elem = await elemToRevContext(elem, rev);
  const body = await options.onRenderElement(elem, rev);
  const rewind = Helmet.rewind();
  rewind.attr.html.lang ??= "en";
  if (rev.hxRequest) return await bodyWithHelmet(body, rewind);
  const html = await toHtml(
    body,
    rewind,
    toInitHead(rev.__init_head, options.initHead),
  );
  return await options.onRenderHtml(html, rev);
};

renderToHtml.check = isValidElement;
