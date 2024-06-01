// jsx-runtime.ts
/**
 * @module
 *
 * This module contains jsx runtime.
 *
 * @example
 * ```json
 * // deno.json / tsconfig.json
 * {
 *    "compilerOptions": {
 *      "jsx": "react-jsx",
 *      "jsxImportSource": "@nhttp/nhttp/jsx"
 *    }
 * }
 * ```
 */
import {
  type EObject,
  Fragment,
  type JSX,
  type JSXElement,
  type JSXNode,
  n,
  type NJSX,
} from "./index.ts";
import { escapeHtml, internal, toStyle } from "./render.ts";

type CreateElement = (
  type: string,
  props?: NJSX.HTMLAttributes & { children?: JSXElement | JSXElement[] },
  ...args: unknown[]
) => JSXNode;
const isArray = Array.isArray;
/**
 * createElement.
 */
const createElement: CreateElement = (type, props) => {
  if (props?.children == null) return n(type, props);
  const childs = props.children;
  delete props.children;
  if (isArray(childs)) return n(type, props, ...childs);
  return n(type, props, childs);
};
export { Fragment };
export { createElement as jsx };
export { createElement as jsxs };
export { createElement as jsxDev };
export { createElement as jsxDEV };
export type { JSX, NJSX };

/**
 * jsxTemplate (jsx-transform precompile).
 */
export const jsxTemplate = (
  tpl: TemplateStringsArray,
  ...subs: JSXNode[]
): JSXElement<EObject> | null => {
  internal.precompile ??= true;
  const ret = [];
  for (let i = 0; i < tpl.length; i++) {
    ret.push(tpl[i]);
    if (i < subs.length) ret.push(subs[i]);
  }
  return n(Fragment, {}, ret);
};
type JSXEsacpe =
  | string
  | number
  | JSXElement<EObject>
  | JSXNode<EObject>[]
  | Promise<JSXElement<EObject>>
  | null;
/**
 * jsxEscape (jsx-transform precompile).
 */
export const jsxEscape = (
  v: string | null | JSXNode | Array<string | null | JSXNode>,
): JSXEsacpe => {
  return v == null || typeof v === "boolean" || typeof v === "function"
    ? null
    : v;
};
/**
 * jsxAttr (jsx-transform precompile).
 */
export const jsxAttr = (k: string, v: unknown): string => {
  if (k === "style" && typeof v === "object") {
    return `${k}="${toStyle(v as Record<string, string | number>)}"`;
  }
  if (
    v == null ||
    v === false ||
    typeof v === "function" ||
    typeof v === "object"
  ) {
    return "";
  } else if (v === true) return k;
  return `${k}="${escapeHtml(v as string, true)}"`;
};
