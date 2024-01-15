import type { TRet } from "../deps.ts";
import type { NJSX } from "./types.ts";
declare global {
  namespace JSX {
    // @ts-ignore: Element
    type Element = JSXElement | Promise<JSXElement>;
    // @ts-ignore: IntrinsicElements
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
import { Helmet } from "./helmet.ts";
export {
  escapeHtml,
  isValidElement,
  options,
  type RenderHTML,
  renderToHtml,
  renderToString,
  type TOptionsRender,
  toStyle,
} from "./render.ts";
export { Helmet, type HelmetRewind } from "./helmet.ts";
export * from "./hook.ts";
export * from "./types.ts";
export * from "./htmx.ts";
export * from "./stream.ts";
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
) => TRet;

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
  props?: NJSX.HTMLAttributes | null,
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
  return {
    type,
    props: children.length > 0 ? { ...props, children } : props,
    key: null,
    // fast check nhttp jsx
    __n__: true,
  } as JSXNode;
}
n.Fragment = Fragment;
export { n as h };

/**
 * Client interactive.
 * @deprecated
 * use Helmet instead.
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

/**
 * Script Component.
 * @example
 * ```jsx
 * const Home = () => {
 *   return (
 *     <>
 *       <Helmet>
 *          <Script>{`console.log("hello")`}</Script>
 *       </Helmet>
 *       <h1>hello</h1>
 *     </>
 *   )
 * }
 * ```
 */
export const Script: FC<NJSX.ScriptHTMLAttributes & { children?: string }> = (
  { children, ...props },
) => {
  props.dangerouslySetInnerHTML = { __html: children ?? "" };
  return n("script", props);
};

/**
 * Style Component.
 * @example
 * ```jsx
 * const Home = () => {
 *   return (
 *     <>
 *       <Helmet>
 *          <Style>{`.title{color:blue}`}</Style>
 *       </Helmet>
 *       <h1 className="title">hello</h1>
 *     </>
 *   )
 * }
 * ```
 */
export const Style: FC<NJSX.StyleHTMLAttributes & { children?: string }> = (
  { children, ...props },
) => {
  props.dangerouslySetInnerHTML = { __html: children ?? "" };
  return n("style", props);
};
