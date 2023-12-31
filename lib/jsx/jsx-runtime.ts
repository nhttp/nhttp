import {
  Fragment,
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

// support jsx-transform precompile.
export const jsxTemplate = (
  tpl: TemplateStringsArray,
  ...subs: JSXNode[]
) => {
  internal.precompile ??= true;
  const ret = [];
  for (let i = 0; i < tpl.length; i++) {
    ret.push(tpl[i]);
    if (i < subs.length) ret.push(subs[i]);
  }
  return n(Fragment, {}, ret);
};
export const jsxEscape = (
  v: string | null | JSXNode | Array<string | null | JSXNode>,
) => {
  return v == null || typeof v === "boolean" || typeof v === "function"
    ? null
    : v;
};
export const jsxAttr = (k: string, v: unknown) => {
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
