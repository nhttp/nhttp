import { Helmet } from "./helmet.ts";
import type { HTMLAttributes, IntrinsicElements as IElement } from "./types.ts";
export * from "./render.ts";
export * from "./helmet.ts";
export * from "./hook.ts";
export * from "./types.ts";
// deno-lint-ignore ban-types
export type EObject = {};
type Merge<A, B> = {
  [K in keyof (A & B)]: (
    K extends keyof B ? B[K]
      : (K extends keyof A ? A[K] : never)
  );
};
export type JSXProps<P = EObject> = Merge<{ children?: JSXNode }, P>;
export type JSXNode<T = EObject> =
  | JSXNode<T>[]
  | JSXElement<T>
  | Promise<JSXElement<T>>
  | string
  | number
  | boolean
  | null
  | undefined;
export const dangerHTML = "dangerouslySetInnerHTML";
declare global {
  namespace JSX {
    // @ts-ignore: elem
    type Element = JSXElement | Promise<JSXElement>;
    // @ts-ignore: IntrinsicElements
    interface IntrinsicElements extends IElement {
      // @ts-ignore: IntrinsicElements
      [k: string]: {
        children?: JSXNode;
        // deno-lint-ignore no-explicit-any
        [k: string]: any;
      };
    }
    interface ElementChildrenAttribute {
      children: EObject;
    }
  }
}

export type JSXElement<T = EObject> = {
  type: string | FC<T>;
  props: T | null | undefined;
  // shim key
  key: number | string | null;
};

/**
 * Function Component (FC).
 * @example
 * const Home: FC<{ title: string; }> = (props) => {
 *   return <h1>{props.title}</h1>
 * }
 */
export type FC<T = EObject> = (
  props: JSXProps<T>,
) => JSXElement | Promise<JSXElement> | null;

/**
 * Fragment.
 * @example
 * const Home: FC<{ title: string; }> = (props) => {
 *   return <Fragment><h1>{props.title}</h1></Fragment>
 * }
 */
export const Fragment: FC = ({ children }) => children as JSXElement;

export function n(
  type: string,
  props?: HTMLAttributes | null,
  ...children: JSXNode[]
): JSXElement;
export function n<T = EObject>(
  type: FC<T>,
  props?: T | null,
  ...children: JSXNode[]
): JSXElement | null;
export function n(
  type: string | FC,
  props?: EObject | null,
  ...children: JSXNode[]
): JSXNode {
  if (children.length > 0) {
    return { type, props: { ...props, children }, key: null };
  }
  return { type, props, key: null };
}
n.Fragment = Fragment;
export { n as h };

/**
 * Client interactive.
 * @example
 * ```jsx
 * const Home = () => {
 *   return (
 *     <Client src="/assets/js/home.js">
 *       <h1 id="text">hey</h1>
 *     </Client>
 *   )
 * }
 * ```
 */
export const Client: FC<{
  src: string;
  footer?: boolean;
  id?: string;
  type?: string;
}> = (props) => {
  props.footer ??= true;
  return n(Fragment, {}, [
    n(
      Helmet,
      { footer: props.footer },
      n(
        "script",
        { src: props.src },
      ),
    ),
    n(props.type ?? "div", { id: props.id }, props.children),
  ]);
};
