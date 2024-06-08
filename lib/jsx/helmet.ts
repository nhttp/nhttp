// helmet.ts
import type { TRet } from "../deps.ts";
import type { JSX, JSXProps, NJSX } from "./index.ts";

/**
 * `type` HelmetRewind.
 */
export type HelmetRewind = {
  /**
   * data helmet from `head`.
   */
  head: JSX.Element[];
  /**
   * data helmet from after `body`.
   */
  footer: JSX.Element[];
  /**
   * attributes.
   */
  attr: {
    /**
     * body attributes.
     */
    body: NJSX.HTMLAttributes;
    /**
     * html attributes.
     */
    html: NJSX.HTMLAttributes;
  };
  /**
   * body.
   */
  body?: JSX.Element;
  /**
   * title.
   */
  title?: string;
};

function toHelmet(elems: JSX.Element[]) {
  const helmet: JSX.Element[] = [];
  let hasBase = false;
  let hasTitle = false;
  for (let i = 0; i < elems.length; i++) {
    const elem = elems[i] as TRet;
    if (elem != null) {
      if (elem.type === "base") {
        if (hasBase) continue;
        hasBase = true;
      } else if (elem.type === "title") {
        if (hasTitle) continue;
        hasTitle = true;
        Helmet.title = elem.props.children[0];
      }
      helmet.push(elem);
    }
  }
  return helmet;
}
/**
 * `type` FCHelmet. shiming for support preact/react.
 */
export type FCHelmet =
  & ((
    props: JSXProps<{
      footer?: boolean;
      children?: JSX.Element[] | JSX.Element | TRet;
    }>,
  ) => TRet)
  & {
    /**
     * Rewind Helmet.
     * @example
     * const { head, footer, body, attr } = Helmet.rewind(<App />);
     */
    rewind: (elem?: JSX.Element) => HelmetRewind;
    /**
     * Custom render.
     * @deprecated
     */
    render: (elem: JSX.Element) => string;
    /**
     * Write head tags.
     * @example
     * const current = Helmet.writeHeadTag?.() ?? [];
     * Helmet.writeHeadTag = () => [
     *   ...current,
     *   <script src="/client.js"></script>
     * ];
     */
    writeHeadTag?: () => JSX.Element[];
    /**
     * Write body tags.
     * @example
     * const current = Helmet.writeFooterTag?.() ?? [];
     * Helmet.writeFooterTag = () => [
     *   ...current,
     *   <script src="/client.js"></script>
     * ];
     */
    writeFooterTag?: () => JSX.Element[];
    /**
     * Write `html` attributes.
     */
    writeHtmlAttr?: () => NJSX.HTMLAttributes;
    /**
     * Write `body` attributes.
     */
    writeBodyAttr?: () => NJSX.HTMLAttributes;
    /**
     * title.
     */
    title?: string;
    /**
     * reset helmet.
     */
    reset: () => void;
  };

const isArray = Array.isArray;
/**
 * Simple SSR Helmet for SEO
 * @example
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
 */
export const Helmet: FCHelmet = ({ children, footer }) => {
  if (children == null) return null;
  if (!isArray(children)) children = [children];
  const heads = Helmet.writeHeadTag?.() ?? [];
  const bodys = Helmet.writeFooterTag?.() ?? [];
  const elements: JSX.Element[] = [];
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (child != null) {
      if (child.type === "html") {
        Helmet.writeHtmlAttr = () => (child.props ?? {}) as NJSX.HTMLAttributes;
      } else if (child.type === "body") {
        Helmet.writeBodyAttr = () => (child.props ?? {}) as NJSX.HTMLAttributes;
      } else elements.push(child);
    }
  }
  if (footer) Helmet.writeFooterTag = () => toHelmet(elements.concat(bodys));
  else Helmet.writeHeadTag = () => toHelmet(elements.concat(heads));
  return null;
};
Helmet.reset = () => {
  Helmet.writeHeadTag = void 0;
  Helmet.writeFooterTag = void 0;
  Helmet.writeHtmlAttr = void 0;
  Helmet.writeBodyAttr = void 0;
  Helmet.title = void 0;
};
Helmet.rewind = (elem) => {
  const data = {
    attr: { body: {}, html: {} },
    head: [],
    footer: [],
    body: elem,
  } as HelmetRewind;
  if (Helmet.writeHeadTag) data.head = Helmet.writeHeadTag();
  if (Helmet.writeFooterTag) data.footer = Helmet.writeFooterTag();
  if (Helmet.writeHtmlAttr) data.attr.html = Helmet.writeHtmlAttr();
  if (Helmet.writeBodyAttr) data.attr.body = Helmet.writeBodyAttr();
  if (Helmet.title !== void 0) data.title = Helmet.title;
  Helmet.reset();
  return data;
};

Helmet.render = () => "";
