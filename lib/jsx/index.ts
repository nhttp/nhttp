import { Helmet as HelmetOri } from "./helmet.ts";
import {
  isValidElement as isValidElementOri,
  renderToHtml as renderToHtmlOri,
  renderToString as renderToStringOri,
} from "./render.ts";

// deno-lint-ignore no-explicit-any
type TRet = any;
const dangerHTML = "dangerouslySetInnerHTML";
declare global {
  namespace JSX {
    // @ts-ignore: elem
    type Element = TRet;
    interface IntrinsicElements {
      // @ts-ignore: just any elem
      [k: string]: TRet;
    }
  }
}
type JsxProps = {
  children?: TRet;
};
export type FC<T extends unknown = unknown> = (
  props: JsxProps & T,
) => JSX.Element;

const emreg =
  /area|base|br|col|embed|hr|img|input|keygen|link|meta|param|source|track|wbr/;

/**
 * Helmet
 * @deprecated
 * Move to `lib/jsx/helmet`.
 * ```ts
 * // Deno
 * import { Helmet } from "https://deno.land/x/nhttp@1.2.19/lib/jsx/helmet.ts";
 *
 * // Node
 * import { Helmet } from "nhttp-land/jsx/helmet";
 * ```
 */
export const Helmet = HelmetOri;
/**
 * renderToHtml
 * @deprecated
 * Move to `lib/jsx/render.ts`.
 * ```ts
 * // Deno
 * import { renderToHtml } from "https://deno.land/x/nhttp@1.2.19/lib/jsx/render.ts";
 *
 * // Node
 * import { renderToHtml } from "nhttp-land/jsx/render";
 * ```
 */
export const renderToHtml = renderToHtmlOri;
/**
 * renderToString
 * @deprecated
 * Move to `lib/jsx/render.ts`.
 * ```ts
 * // Deno
 * import { renderToString } from "https://deno.land/x/nhttp@1.2.19/lib/jsx/render.ts";
 *
 * // Node
 * import { renderToString } from "nhttp-land/jsx/render";
 * ```
 */
export const renderToString = renderToStringOri;
export const isValidElement = isValidElementOri;

function escapeHtml(unsafe: string) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
export function n(
  type: TRet,
  props: TRet | undefined | null,
  ...args: TRet[]
) {
  props ??= { children: "" };
  if (!type) return "";
  const children = args.map((el) => {
    return typeof el === "number" ? String(el) : el;
  }).filter(Boolean);
  if (typeof type === "function") {
    props.children = children.join("");
    return type(props);
  }
  let str = `<${type}`;
  for (let k in props) {
    const val = props[k];
    if (
      val !== undefined &&
      val !== null &&
      k !== dangerHTML &&
      k !== "children"
    ) {
      if (typeof k === "string") {
        k = k.toLowerCase();
        if (k === "classname") k = "class";
      }
      const type = typeof val;
      if (type === "boolean" || type === "object") {
        if (type === "object") {
          str += ` ${k}="${
            Object.keys(val).reduce(
              (a, b) =>
                a +
                b
                  .split(/(?=[A-Z])/)
                  .join("-")
                  .toLowerCase() +
                ":" +
                (typeof val[b] === "number" ? val[b] + "px" : val[b]) +
                ";",
              "",
            )
          }"`;
        } else if (val === true) str += ` ${k}`;
        else if (val === false) str += "";
      } else str += ` ${k}="${escapeHtml(val.toString())}"`;
    }
  }
  str += ">";
  if (emreg.test(type)) return str;
  if (props[dangerHTML]) {
    str += props[dangerHTML].__html;
  } else {
    children.forEach((child) => {
      if (typeof child === "string") str += child;
      else if (Array.isArray(child)) str += child.join("");
    });
  }
  return (str += type ? `</${type}>` : "");
}
export function h(type: TRet, props: TRet | undefined | null, ...args: TRet[]) {
  return n(type, props, ...args);
}
export const Fragment: FC = ({ children }) => children;
n.Fragment = Fragment;
h.Fragment = Fragment;
