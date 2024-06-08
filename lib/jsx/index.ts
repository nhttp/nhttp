// index.ts
/**
 * @module
 *
 * This module contains core jsx for NHttp.
 *
 * @example
 * ```tsx
 * // example JSX + Htmx
 * import nhttp from "@nhttp/nhttp";
 * import { htmx, renderToHtml } from "@nhttp/nhttp/jsx";
 *
 * const app = nhttp();
 *
 * app.engine(renderToHtml);
 *
 * app.use(htmx());
 *
 * app.get("/", () => {
 *   return (
 *      <button hx-post="/clicked" hx-swap="outerHTML">
 *        Click Me
 *      </button>
 *   );
 * });
 *
 * app.post("/clicked", () => {
 *    return <span>It's Me</span>;
 * });
 *
 * app.listen(8000);
 * ```
 */
import type { TRet } from "../deps.ts";
import type { NJSX } from "./types.ts";
import {
  type FCHelmet,
  Helmet as HelmetCore,
  type HelmetRewind,
} from "./helmet.ts";
/**
 * namespace JSX.
 */
// deno-lint-ignore no-namespace
export namespace JSX {
  /**
   * `type` JSX.Element.
   */
  export type Element = JSXElement | Promise<JSXElement>;
  /**
   * `interface` JSX.IntrinsicElements.
   */
  export interface IntrinsicElements extends NJSX.IntrinsicElements {
    [k: string]: {
      children?: JSXNode;
      [k: string]: TRet;
    };
  }
  /**
   * `interface` JSX.ElementChildrenAttribute.
   */
  export interface ElementChildrenAttribute {
    children: EObject;
  }
}
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
/**
 * Simple SSR Helmet for SEO
 * @example
 * ```jsx
 * const Home: FC = (props) => {
 *   return  (
 *     <>
 *       <Helmet>
 *         <title>Home Title</title>
 *       </Helmet>
 *       <h1>Home Page</h1>
 *     </>
 *   )
 * }
 * ```
 */
export const Helmet: FCHelmet = HelmetCore;
export * from "./hook.ts";
export * from "./types.ts";
export * from "./htmx.ts";
export * from "./stream.ts";
export type { HelmetRewind };
// deno-lint-ignore ban-types
export type EObject = {};
type Merge<A, B> = {
  [K in keyof (A & B)]: (
    K extends keyof B ? B[K]
      : (K extends keyof A ? A[K] : never)
  );
};
/**
 * `type` JSXProps.
 */
export type JSXProps<P = EObject> = Merge<{ children?: JSXNode }, P>;
/**
 * `type` JSXNode.
 */
export type JSXNode<T = EObject> =
  | JSXNode<T>[]
  | JSXElement<T>
  | Promise<JSXElement<T>>
  | string
  | number
  | boolean
  | null
  | undefined;
/**
 * tag `dangerouslySetInnerHTML`.
 */
export const dangerHTML = "dangerouslySetInnerHTML";
/**
 * `type` JSXElement.
 */
export type JSXElement<T = EObject> = {
  /**
   * type (html tag) / FC.
   */
  type: string | FC<T>;
  /**
   * property / attributes.
   */
  props: T | null | undefined;
  /**
   * shim key.
   */
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

/**
 * JSX compose.
 * @example
 * const Home = (props) => {
 *   return n("h1", {}, ["hello"]);
 * }
 */
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
const FragmentExpando = Fragment;
n.Fragment = FragmentExpando;
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
