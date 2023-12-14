import { Fragment, type HTMLAttributes, type JSXElement, type JSXNode } from "./index";
type CreateElement = (type: string, props?: HTMLAttributes & {
    children?: JSXElement | JSXElement[];
}, ...args: unknown[]) => JSXNode;
declare const createElement: CreateElement;
export { Fragment };
export { createElement as jsx };
export { createElement as jsxs };
export { createElement as jsxDev };
export { createElement as jsxDEV };
export declare const jsxTemplate: (tpl: TemplateStringsArray, ...subs: JSXNode[]) => Promise<string>;
export declare const jsxEscape: (v: string | null | JSXNode | Array<string | null | JSXNode>) => string | number | JSXElement<import("./index").EObject> | JSXNode<import("./index").EObject>[] | Promise<JSXElement<import("./index").EObject>>;
export declare const jsxAttr: (k: string, v: unknown) => string;
