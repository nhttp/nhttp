import { Helmet } from "./helmet.ts";
export * from "./render.ts";
export * from "./helmet.ts";
export type JSXNode =
  | JSXNode[]
  | JSXElement
  | string
  | number
  | boolean
  | null
  | undefined;
export const dangerHTML = "dangerouslySetInnerHTML";
declare global {
  namespace JSX {
    interface Element extends JSXElement {}
    interface IntrinsicElements {
      [k: string]: Attributes & { children?: JSXNode };
    }
    interface ElementChildrenAttribute {
      children: {};
    }
  }
}
type Fragment = null;
export type JSXElement<T = {}> = {
  type: string | FC<T>;
  props: T | null | undefined;
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
export type FC<T = {}> = (props: T) => JSXElement | null;

/**
 * Fragment.
 * @example
 * const Home: FC<{ title: string; }> = (props) => {
 *   return <Fragment><h1>{props.title}</h1></Fragment>
 * }
 */
export const Fragment = null;

export function n(
  type: string,
  props?: Attributes | null,
  ...children: JSXNode[]
): JSXElement;
export function n<T extends {} = {}>(
  type: FC<T>,
  props?: T | null,
  ...children: JSXNode[]
): JSXElement | null;
export function n(
  type: Fragment,
  props?: {} | null,
  ...children: JSXNode[]
): JSXElement;
export function n(
  type: string | FC | null,
  props?: {} | null,
  ...children: JSXNode[]
): JSXNode {
  if (type === null)
    return children
  if (children.length > 0)
    return { type, props: { ...props, children } };
  return { type, props };
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
  children?: JSXNode;
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
