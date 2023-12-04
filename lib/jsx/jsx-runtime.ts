import {
  type Attributes,
  escapeHtml,
  Fragment,
  type JSXElement,
  type JSXNode,
  n,
  options,
  renderToString,
  toStyle,
} from "./index.ts";

type CreateElement = (
  type: string,
  props?: Attributes & { children?: JSXElement | JSXElement[] },
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
export const jsxTemplate = (tpl: TemplateStringsArray, ...subs: JSXNode[]) => {
  options.precompile ??= true;
  return tpl.reduce((prev, cur, i) => {
    return prev + renderToString(subs[i - 1]) + cur;
  });
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
