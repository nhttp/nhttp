// jsx.ts
import type { TRet } from "./deps.ts";
import type { EObject, JSXElement, JSXNode, NJSX } from "./jsx/index.ts";

declare global {
  namespace JSX {
    type Element = JSXElement | Promise<JSXElement>;
    interface IntrinsicElements extends NJSX.IntrinsicElements {
      [k: string]: {
        children?: JSXNode;
        [k: string]: TRet;
      };
    }
    interface ElementChildrenAttribute {
      children: EObject;
    }
  }
}
export * from "./jsx/index.ts";
