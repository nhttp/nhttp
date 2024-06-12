// render.ts
import type { RequestEvent, TObject, TRet } from "../deps.ts";
import { Helmet } from "./helmet.ts";
import {
  dangerHTML,
  elemToRevContext,
  type FC,
  type HelmetRewind,
  type JSX,
  type JSXNode,
  type NJSX,
} from "./index.ts";
import { isValidElement } from "./is-valid-element.ts";

export { isValidElement };
/**
 * `type` TOptionsRender.
 */
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
   * custom charset. default to `UTF-8`.
   */
  charset?: string | boolean;
  /**
   * custom viewport. default to `content="width=device-width, initial-scale=1.0"`.
   */
  viewport?: string | boolean;
  /**
   * use context requestEvent. default to `true`.
   */
  requestEventContext: boolean;
  /**
   * initial Head.
   */
  initHead?: string;
};
/**
 * Share internal config.
 */
export const internal = {} as TObject;
/**
 * Share options config.
 */
export const options: TOptionsRender =
  ((globalThis as TRet).NHttpJSXOptions as TOptionsRender) = {
    onRenderHtml: (html) => html,
    onRenderElement: renderToString,
    onRenderStream: (stream) => stream,
    requestEventContext: true,
  };
/**
 * Share options config.
 */
export const getOptions = (): TOptionsRender =>
  (globalThis as TRet).NHttpJSXOptions;
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
const nonPxCss: Record<string, boolean> = Object.assign(Object.create(null), {
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
/**
 * helper `toInitHead`.
 */
export function toInitHead(
  a: string | undefined,
  b: string | undefined,
): string | undefined {
  if (a !== void 0 && b !== void 0) return b + a;
  return a || b;
}
/**
 * list mutate attribute.
 */
export const mutateAttr: Record<string, string> = {
  acceptCharset: "accept-charset",
  httpEquiv: "http-equiv",
  htmlFor: "for",
  className: "class",
};
// handle alpine/vue e.g. at-click to @click
function withAt(k: string): string {
  return k.startsWith("at-") ? "@" + k.slice(3) : k;
}
/**
 * helper props to attribute.
 */
export const toAttr = (props: TRet = {}): string => {
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
/**
 * set default options config.
 */
export function serializeOpts(): TOptionsRender {
  const opts = getOptions();
  opts.docType ??= "<!DOCTYPE html>";
  if (opts.charset === true || opts.charset === void 0) {
    opts.charset = "UTF-8";
  }
  if (opts.viewport === true || opts.viewport === void 0) {
    opts.viewport = "width=device-width, initial-scale=1.0";
  }
  return opts;
}
/**
 * create html from body, helmet and init-head.
 */
export const toHtml = async (
  body: string,
  { head, footer, attr }: HelmetRewind,
  initHead = "",
): Promise<string> => {
  const opts = serializeOpts();
  return (
    opts.docType +
    `<html${toAttr(attr.html)}>` +
    "<head>" +
    (opts.charset ? `<meta charset="${opts.charset}">` : "") +
    (opts.viewport ? `<meta name="viewport" content="${opts.viewport}">` : "") +
    initHead + (head.length > 0 ? (await renderToString(head)) : "") +
    `</head><body${toAttr(attr.body)}>${body}` +
    (footer.length > 0 ? (await renderToString(footer)) : "") +
    "</body></html>"
  );
};
/**
 * `type` RenderHTML.
 */
export type RenderHTML = ((...args: TRet) => TRet) & {
  /**
   * check is valid element.
   */
  check: (elem: TRet) => boolean;
};
const REG_HTML = /["'&<>]/;
/**
 * escape HTML.
 */
export function escapeHtml(str: string, force?: boolean): string {
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
function kebab(camelCase: string): string {
  return camelCase.replace(/[A-Z]/g, "-$&").toLowerCase();
}
/**
 * helper from object to string in style-css.
 */
export function toStyle(obj: NJSX.CSSProperties): string | undefined {
  let out = "";
  for (const k in obj) {
    const val = obj[k];
    if (val != null && val !== "") {
      const name = k[0] === "-" ? k : (KEBAB_CSS[k] ??= kebab(k));
      let s = ";";
      if (
        typeof val === "number" &&
        !name.startsWith("--") &&
        !(name in nonPxCss)
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
/**
 * join body with helmet.
 */
export async function bodyWithHelmet(
  body: string,
  { title, footer }: HelmetRewind,
): Promise<string> {
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
  const opt = getOptions();
  const body = await opt.onRenderElement(elem, rev);
  const rewind = Helmet.rewind();
  rewind.attr.html.lang ??= "en";
  if (rev.hxRequest) return await bodyWithHelmet(body, rewind);
  const html = await toHtml(
    body,
    rewind,
    toInitHead(rev.__init_head, opt.initHead),
  );
  return await opt.onRenderHtml(html, rev);
};

renderToHtml.check = isValidElement;
