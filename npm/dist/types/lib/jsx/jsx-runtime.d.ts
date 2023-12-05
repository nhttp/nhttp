import { type Attributes, Fragment, type JSXElement, type JSXNode } from "./index";
type CreateElement = (type: string, props?: Attributes & {
    children?: JSXElement | JSXElement[];
}, ...args: unknown[]) => JSXNode;
declare const createElement: CreateElement;
export { Fragment };
export { createElement as jsx };
export { createElement as jsxs };
export { createElement as jsxDev };
export { createElement as jsxDEV };
export declare const jsxTemplate: (tpl: TemplateStringsArray, ...subs: JSXNode[]) => string;
export declare const jsxEscape: (v: string | null | JSXNode | Array<string | null | JSXNode>) => string | number | JSXNode<{}>[] | JSXElement<{}>;
export declare const jsxAttr: (k: string, v: unknown) => string;
