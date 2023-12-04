import { Helmet } from "./helmet.ts";
export * from "./render.ts";
export * from "./helmet.ts";
// deno-lint-ignore ban-types
type EObject = {};
type Merge<A, B> = {
  [K in keyof (A & B)]: (
    K extends keyof B ? B[K]
      : (K extends keyof A ? A[K] : never)
  );
};
export type JSXNode<T = EObject> =
  | JSXNode<T>[]
  | JSXElement<T>
  | string
  | number
  | boolean
  | null
  | undefined;
export const dangerHTML = "dangerouslySetInnerHTML";
declare global {
  namespace JSX {
    // @ts-ignore: elem
    type Element = JSXElement;
    interface IntrinsicElements {
      // @ts-ignore: IntrinsicElements
      [k: string]: Attributes & { children?: JSXNode };
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
export type Attributes = {
  style?: string | Record<string, string | number>;
  [dangerHTML]?: { __html: string };
  [name: string]: unknown;
};

/**
 * Function Component (FC).
 * @example
 * const Home: FC<{ title: string; }> = (props) => {
 *   return <h1>{props.title}</h1>
 * }
 */
export type FC<T = EObject> = (
  props: Merge<{ children?: JSXNode }, T>,
) => JSXElement | null;

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
  props?: Attributes | null,
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
  id?: string;
  type?: string;
}> = (props) => {
  return n(Fragment, {}, [
    n(
      Helmet,
      { footer: true },
      n(
        "script",
        { src: props.src },
      ),
    ),
    n(props.type ?? "div", { id: props.id }, props.children),
  ]);
};
